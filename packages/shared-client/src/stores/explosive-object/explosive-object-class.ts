import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassDTO, type IExplosiveObjectClassAPI } from '~/api';
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
    type IExplosiveObjectClass,
    type IExplosiveObjectClassData,
    createExplosiveObjectClassDTO,
    ExplosiveObjectClass,
    createExplosiveObjectClass,
    type IExplosiveObjectClassItem,
    type IExplosiveObjectClassItemData,
} from './entities';
import { type IViewerStore } from '../viewer';

interface IApi {
    explosiveObjectClass: IExplosiveObjectClassAPI;
}

interface IServices {
    message: IMessage;
}

interface ILists {
    classItem: IListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
}

interface ICollections {
    classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
}

export interface IExplosiveObjectClassStore {
    collection: CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    list: IListModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    search: ISearchModel<IExplosiveObjectClass>;
    create: IRequestModel<[ICreateValue<IExplosiveObjectClassData>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel;
    fetchItem: IRequestModel<[string]>;
    subscribe: IRequestModel;
}

interface IStores {
    viewer?: IViewerStore;
}

export class ExplosiveObjectClassStore implements IExplosiveObjectClassStore {
    api: IApi;
    services: IServices;
    lists: ILists;
    collections: ICollections;
    getStores: () => IStores;

    collection = new CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        factory: (data: IExplosiveObjectClassData) => new ExplosiveObjectClass(data, this),
    });

    list = new ListModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        collection: this.collection,
    });

    search = new SearchModel<IExplosiveObjectClass, IExplosiveObjectClassData>(this.list, { fields: ['displayName'] });

    constructor(params: { api: IApi; services: IServices; lists: ILists; collections: ICollections; getStores: () => IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.lists = params.lists;
        this.collections = params.collections;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveObjectClassData>) => {
            const res = await this.api.explosiveObjectClass.create(createExplosiveObjectClassDTO(data));
            const value = createExplosiveObjectClass(res);
            this.list.unshift(value);
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosiveObjectClass.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async () => {
            const res = await this.api.explosiveObjectClass.getList();
            this.list.set(res.map(createExplosiveObjectClass));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveObjectClass.get(id);
            this.collection.set(res.id, createExplosiveObjectClass(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    subscribe = new RequestModel({
        run: async () => {
            await this.api.explosiveObjectClass.subscribe(null, (values: ISubscriptionDocument<IExplosiveObjectClassDTO>[]) => {
                const { create, update, remove } = data.sortByType<IExplosiveObjectClassDTO, IExplosiveObjectClassData>(
                    values,
                    createExplosiveObjectClass,
                );

                this.list.push(create);
                this.collection.updateArr(update);
                this.collection.remove(remove);
            });
        },
    });
}
