import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { explosiveObjectTypesData } from 'shared-my/db';

import { type IExplosiveObjectAPI, type IExplosiveObjectActionSumDTO, type IExplosiveObjectDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    ExplosiveObject,
    ExplosiveObjectType,
    type IExplosiveObject,
    type IExplosiveObjectType,
    type IExplosiveObjectData,
    type IExplosiveObjectTypeData,
    type IExplosiveObjectDataParams,
    createExplosiveObject,
    createExplosiveObjectDTO,
    createExplosiveObjectType,
    type IExplosiveObjectActionData,
    type IExplosiveObjectAction,
    createExplosiveObjectActionSum,
    ExplosiveObjectAction,
} from './entities';
import { SumExplosiveObjectActions } from './sum-explosive-object-actions';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

export interface IExplosiveObjectStore {
    collectionTypes: CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    collectionActions: CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>;
    collection: CollectionModel<IExplosiveObject, IExplosiveObjectData>;
    listTypes: ListModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    list: ListModel<IExplosiveObject, IExplosiveObjectData>;
    searchList: ListModel<IExplosiveObject, IExplosiveObjectData>;
    sum: SumExplosiveObjectActions;
    sortedListTypes: IExplosiveObjectType[];
    setSum: (sum: IExplosiveObjectActionSumDTO) => void;
    init: () => void;
    append: (res: IExplosiveObjectDTO[], isSearch: boolean, isMore?: boolean) => void;
    create: RequestModel<[ICreateValue<IExplosiveObjectDataParams>]>;
    remove: RequestModel<[string]>;
    createExplosiveObjects: RequestModel;
    fetchList: RequestModel<[search?: string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
}

export class ExplosiveObjectStore implements IExplosiveObjectStore {
    api: IApi;
    services: IServices;

    collectionTypes = new CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        factory: (data: IExplosiveObjectTypeData) => new ExplosiveObjectType(data),
    });
    collectionActions = new CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>({
        factory: (data: IExplosiveObjectActionData) =>
            new ExplosiveObjectAction(data, { collections: { type: this.collectionTypes }, ...this }),
    });
    collection = new CollectionModel<IExplosiveObject, IExplosiveObjectData>({
        factory: (data: IExplosiveObjectData) => new ExplosiveObject(data, { collections: { type: this.collectionTypes }, ...this }),
    });
    listTypes = new ListModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        collection: this.collectionTypes,
    });
    list = new ListModel<IExplosiveObject, IExplosiveObjectData>({ collection: this.collection });
    searchList = new ListModel<IExplosiveObject, IExplosiveObjectData>({
        collection: this.collection,
    });
    sum = new SumExplosiveObjectActions();

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get sortedListTypes() {
        return this.listTypes.asArray.sort((a, b) =>
            a.data.fullName.localeCompare(b.data.fullName, ['uk'], {
                numeric: true,
                sensitivity: 'base',
            }),
        );
    }
    setSum(sum: IExplosiveObjectActionSumDTO) {
        this.sum.set(createExplosiveObjectActionSum(sum));
    }

    init() {
        const data = explosiveObjectTypesData.map(createExplosiveObjectType);
        this.listTypes.push(data, true);
    }
    append(res: IExplosiveObjectDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createExplosiveObject), true);
    }
    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveObjectDataParams>) => {
            const res = await this.api.explosiveObject.create(createExplosiveObjectDTO(data));
            this.list.unshift(createExplosiveObject(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosiveObject.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    createExplosiveObjects = new RequestModel({
        run: () => this.api.explosiveObject.init(),
        onSuccuss: () => this.services.message.success('Виконано успішно'),
        onError: () => this.services.message.error('Не вдалось виконати'),
    });

    fetchList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return !(!isSearch && list.length);
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.explosiveObject.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return list.isMorePages;
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.explosiveObject.getList({
                limit: list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            list.push(res.map(createExplosiveObject), true);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await this.api.explosiveObject.sum({
                where: {
                    executedAt: {
                        '>=': dates.toDateServer(startDate),
                        '<=': dates.toDateServer(endDate),
                    },
                },
            });

            this.setSum(res);
        },
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveObject.get(id);
            this.collection.set(res.id, createExplosiveObject(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
