import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';
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
    create: IRequestModel<[ICreateValue<IExplosiveObjectClassData>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel;
    fetchItem: IRequestModel<[string]>;
}

export class ExplosiveObjectClassStore implements IExplosiveObjectClassStore {
    api: IApi;
    services: IServices;
    lists: ILists;
    collections: ICollections;

    collection = new CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        factory: (data: IExplosiveObjectClassData) => new ExplosiveObjectClass(data, this),
    });

    list = new ListModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        collection: this.collection,
    });

    constructor(params: { api: IApi; services: IServices; lists: ILists; collections: ICollections }) {
        this.api = params.api;
        this.services = params.services;
        this.lists = params.lists;
        this.collections = params.collections;

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
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveObjectClass.get(id);
            this.collection.set(res.id, createExplosiveObjectClass(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
