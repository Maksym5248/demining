import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectTypeDTO, type IExplosiveObjectTypeAPI } from '~/api';
import { type ISubscriptionDocument, type ICreateValue, data } from '~/common';
import {
    CollectionModel,
    type ICollectionModel,
    type IListModel,
    type IRequestModel,
    type ISearchModel,
    ListModel,
    RequestModel,
    SearchModel,
} from '~/models';
import { type IMessage } from '~/services';

import {
    ExplosiveObjectType,
    type IExplosiveObjectTypeDataParams,
    createExplosiveObjectType,
    createExplosiveObjectTypeDTO,
    type IExplosiveObjectType,
    type IExplosiveObjectTypeData,
} from './entities';
import { type IViewerStore } from '../viewer';

interface IApi {
    explosiveObjectType: IExplosiveObjectTypeAPI;
}

interface IServices {
    message: IMessage;
}

export interface IExplosiveObjectTypeStore {
    collection: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    list: IListModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    search: ISearchModel<IExplosiveObjectType>;
    create: IRequestModel<[ICreateValue<IExplosiveObjectTypeDataParams>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel;
    fetchItem: IRequestModel<[string]>;
    sortedListTypes: IExplosiveObjectType[];
    sync: IRequestModel;
}

interface IStores {
    viewer?: IViewerStore;
}

export class ExplosiveObjectTypeStore implements IExplosiveObjectTypeStore {
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    collection: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData> = new CollectionModel<
        IExplosiveObjectType,
        IExplosiveObjectTypeData
    >({
        factory: (data: IExplosiveObjectTypeData) => new ExplosiveObjectType(data, this),
    });

    list = new ListModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        collection: this.collection,
    });

    search = new SearchModel<IExplosiveObjectType, IExplosiveObjectTypeData>(this.list, { fields: ['displayName'] });

    constructor(params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveObjectTypeDataParams>) => {
            const res = await this.api.explosiveObjectType.create(createExplosiveObjectTypeDTO(data));
            const value = createExplosiveObjectType(res);
            this.list.unshift(value);
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosiveObjectType.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async () => {
            const res = await this.api.explosiveObjectType.getList();
            this.list.set(res.map(createExplosiveObjectType));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveObjectType.get(id);
            this.collection.set(res.id, createExplosiveObjectType(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    get sortedListTypes() {
        return this.list.asArray.sort((a, b) =>
            a.data.name.localeCompare(b.data.name, ['uk'], {
                numeric: true,
                sensitivity: 'base',
            }),
        );
    }

    sync = new RequestModel({
        run: async () => {
            await this.api.explosiveObjectType.sync(null, (values: ISubscriptionDocument<IExplosiveObjectTypeDTO>[]) => {
                const { create, update, remove } = data.sortByType<IExplosiveObjectTypeDTO, IExplosiveObjectTypeData>(
                    values,
                    createExplosiveObjectType,
                );

                this.list.push(create);
                this.collection.update(update);
                this.collection.remove(remove);
            });
        },
    });
}
