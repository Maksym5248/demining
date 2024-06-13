import { message } from 'antd';
import { type Dayjs } from 'dayjs';

import { Api, type IExplosiveObjectActionSumDTO, type IExplosiveObjectDTO } from '~/api';
import { explosiveObjectTypesData } from '~/data';
import { type CreateValue } from '~/types';
import { dates } from '~/utils';
import { CollectionModel, ListModel, RequestModel } from '~/utils/models';

import {
    ExplosiveObject,
    ExplosiveObjectType,
    type IExplosiveObject,
    type IExplosiveObjectType,
    type IExplosiveObjectValue,
    type IExplosiveObjectTypeValue,
    type IExplosiveObjectValueParams,
    createExplosiveObject,
    createExplosiveObjectDTO,
    createExplosiveObjectType,
    type IExplosiveObjectActionValue,
    type IExplosiveObjectAction,
    createExplosiveObjectActionSum,
    ExplosiveObjectAction,
} from './entities';
import { SumExplosiveObjectActions } from './sum-explosive-object-actions';

export interface IExplosiveObjectStore {
    collectionTypes: CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeValue>;
    collectionActions: CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionValue>;
    collection: CollectionModel<IExplosiveObject, IExplosiveObjectValue>;
    listTypes: ListModel<IExplosiveObjectType, IExplosiveObjectTypeValue>;
    list: ListModel<IExplosiveObject, IExplosiveObjectValue>;
    searchList: ListModel<IExplosiveObject, IExplosiveObjectValue>;
    sum: SumExplosiveObjectActions;
    sortedListTypes: IExplosiveObjectType[];
    setSum: (sum: IExplosiveObjectActionSumDTO) => void;
    init: () => void;
    append: (res: IExplosiveObjectDTO[], isSearch: boolean, isMore?: boolean) => void;
    create: RequestModel<[CreateValue<IExplosiveObjectValueParams>]>;
    remove: RequestModel<[string]>;
    createExplosiveObjects: RequestModel;
    fetchList: RequestModel<[search?: string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
}

export class ExplosiveObjectStore implements IExplosiveObjectStore {
    collectionTypes = new CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeValue>({
        factory: (data: IExplosiveObjectTypeValue) => new ExplosiveObjectType(data),
    });
    collectionActions = new CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionValue>({
        factory: (data: IExplosiveObjectActionValue) => new ExplosiveObjectAction(data, { collections: { type: this.collectionTypes } }),
    });
    collection = new CollectionModel<IExplosiveObject, IExplosiveObjectValue>({
        factory: (data: IExplosiveObjectValue) => new ExplosiveObject(data, { collections: { type: this.collectionTypes } }),
    });
    listTypes = new ListModel<IExplosiveObjectType, IExplosiveObjectTypeValue>({ collection: this.collectionTypes });
    list = new ListModel<IExplosiveObject, IExplosiveObjectValue>({ collection: this.collection });
    searchList = new ListModel<IExplosiveObject, IExplosiveObjectValue>({ collection: this.collection });
    sum = new SumExplosiveObjectActions();

    get sortedListTypes() {
        return this.listTypes.asArray.sort((a, b) =>
            a.fullName.localeCompare(b.fullName, ['uk'], {
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
        run: async (data: CreateValue<IExplosiveObjectValueParams>) => {
            const res = await Api.explosiveObject.create(createExplosiveObjectDTO(data));
            this.list.unshift(createExplosiveObject(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.explosiveObject.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
    });

    createExplosiveObjects = new RequestModel({
        run: () => Api.createExplosiveObjects(),
        onSuccuss: () => message.success('Виконано успішно'),
        onError: () => message.error('Не вдалось виконати'),
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

            const res = await Api.explosiveObject.getList({
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

            const res = await Api.explosiveObject.getList({
                limit: list.pageSize,
                startAfter: dates.toDateServer(this.list.last.createdAt),
            });

            list.push(res.map(createExplosiveObject), true);
        },
        onError: () => message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await Api.explosiveObject.sum({
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
            const res = await Api.explosiveObject.get(id);
            this.collection.set(res.id, createExplosiveObject(res));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
