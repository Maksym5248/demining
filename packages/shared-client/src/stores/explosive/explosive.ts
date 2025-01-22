import { makeAutoObservable } from 'mobx';

import { type IExplosiveAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IExplosive, type IExplosiveData, createExplosive, createExplosiveDTO, Explosive } from './entities';
import { type IViewerStore } from '../viewer';

export interface IExplosiveStore {
    collection: CollectionModel<IExplosive, IExplosiveData>;
    list: ListModel<IExplosive, IExplosiveData>;
    create: RequestModel<[ICreateValue<IExplosiveData>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
    fetchByIds: RequestModel<[string[]]>;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer?: IViewerStore;
}

export class ExplosiveStore implements IExplosiveStore {
    api: IApi;
    services: IServices;
    getStores: () => IStores;
    collection = new CollectionModel<IExplosive, IExplosiveData>({
        factory: (data: IExplosiveData) => new Explosive(data, this),
    });
    list = new ListModel<IExplosive, IExplosiveData>({ collection: this.collection });

    constructor(params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveData>) => {
            const res = await this.api.explosive.create(createExplosiveDTO(data));

            this.list.unshift(createExplosive(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosive.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.explosive.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createExplosive));
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.explosive.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createExplosive));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosive.get(id);
            this.collection.set(res.id, createExplosive(res));
            await this.fetchItemDeeps.run(id);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItemDeeps = new RequestModel({
        run: async (id: string) => {
            const item = this.collection.get(id);
            const ids = (item?.data.composition?.map(i => i.explosiveId).filter(Boolean) as string[]) || [];
            await this.fetchByIds.run(ids);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchByIds = new RequestModel({
        run: async (ids: string[]) => {
            console.log('fetchByIds', ids);
            const res = await this.api.explosive.getByIds(ids);
            this.collection.setArr(res.map(createExplosive));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
