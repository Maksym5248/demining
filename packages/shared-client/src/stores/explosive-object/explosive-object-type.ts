import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectTypeAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { CollectionModel, type IListModel, type IRequestModel, type ISearchModel, ListModel, RequestModel, SearchModel } from '~/models';
import { type IMessage } from '~/services';

import {
    ExplosiveObjectType,
    type IExplosiveObjectTypeDataParams,
    createExplosiveObjectType,
    createExplosiveObjectTypeDTO,
    type IExplosiveObjectType,
    type IExplosiveObjectTypeData,
} from './entities';

interface IApi {
    explosiveObjectType: IExplosiveObjectTypeAPI;
}

interface IServices {
    message: IMessage;
}

export interface IExplosiveObjectTypeStore {
    collection: CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    list: IListModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    search: ISearchModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    create: IRequestModel<[ICreateValue<IExplosiveObjectTypeDataParams>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel;
    fetchItem: IRequestModel<[string]>;
    sortedListTypes: IExplosiveObjectType[];
}

export class ExplosiveObjectTypeStore implements IExplosiveObjectTypeStore {
    api: IApi;
    services: IServices;

    collection = new CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        factory: (data: IExplosiveObjectTypeData) =>
            new ExplosiveObjectType(data, {
                api: this.api,
                services: this.services,
            }),
    });

    list = new ListModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        collection: this.collection,
    });

    search = new SearchModel<IExplosiveObjectType, IExplosiveObjectTypeData>(this.list, { fields: ['displayName'] });

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

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
        onError: () => this.services.message.error('Не вдалось видалити'),
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
}
