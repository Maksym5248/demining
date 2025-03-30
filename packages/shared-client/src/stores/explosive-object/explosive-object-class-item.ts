import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassItemDTO, type IExplosiveObjectClassItemAPI } from '~/api';
import { data, type ISubscriptionDocument, type ICreateValue } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IExplosiveObjectClassItem,
    type IExplosiveObjectClassItemData,
    createExplosiveObjectClassItemDTO,
    createExplosiveObjectClassItem,
    ExplosiveObjectClassItem,
} from './entities';
import { type IViewerStore } from '../viewer';

interface IApi {
    explosiveObjectClassItem: IExplosiveObjectClassItemAPI;
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

export interface IExplosiveObjectClassItemStore {
    collection: CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    list: IListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    create: IRequestModel<[ICreateValue<IExplosiveObjectClassItemData>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel;
    fetchItem: IRequestModel<[string]>;
    subscribe: IRequestModel;
}

interface IStores {
    viewer?: IViewerStore;
}

export class ExplosiveObjectClassItemStore implements IExplosiveObjectClassItemStore {
    api: IApi;
    services: IServices;
    lists: ILists;
    collections: ICollections;
    getStores: () => IStores;

    collection = new CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>({
        factory: (data: IExplosiveObjectClassItemData) => new ExplosiveObjectClassItem(data, this),
    });

    list = new ListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>({
        collection: this.collection,
    });

    constructor(params: { api: IApi; services: IServices; lists: ILists; collections: ICollections; getStores: () => IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.lists = params.lists;
        this.collections = params.collections;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveObjectClassItemData>) => {
            const res = await this.api.explosiveObjectClassItem.create(createExplosiveObjectClassItemDTO(data));
            const value = createExplosiveObjectClassItem(res);
            this.list.unshift(value);
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosiveObjectClassItem.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async () => {
            const res = await this.api.explosiveObjectClassItem.getList();
            this.list.set(res.map(createExplosiveObjectClassItem));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveObjectClassItem.get(id);
            this.collection.set(res.id, createExplosiveObjectClassItem(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    subscribe = new RequestModel({
        run: async () => {
            await this.api.explosiveObjectClassItem.subscribe(null, (values: ISubscriptionDocument<IExplosiveObjectClassItemDTO>[]) => {
                const { create, update, remove } = data.sortByType<IExplosiveObjectClassItemDTO, IExplosiveObjectClassItemData>(
                    values,
                    createExplosiveObjectClassItem,
                );

                this.list.push(create);
                this.collection.update(update);
                this.collection.remove(remove);
            });
        },
    });
}
