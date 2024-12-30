import { makeAutoObservable } from 'mobx';

import { type IOrganizationAPI, type ICreateOrganizationDTO } from '~/api';
import { dates } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IOrganization,
    type IOrganizationValue,
    Organization,
    createOrganization,
    createOrganizationDTO,
} from './entities/organization';
import { type IUserStore } from '../user';
import { type IViewerStore } from '../viewer';

interface IApi {
    organization: IOrganizationAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer: IViewerStore;
    user: IUserStore;
}

interface IOrganizationStoreParams {
    getStores: () => IStores;
    api: IApi;
    services: IServices;
}

export interface IOrganizationStore {
    collection: ICollectionModel<IOrganization, IOrganizationValue>;
    list: IListModel<IOrganization, IOrganizationValue>;
    create: RequestModel<[ICreateOrganizationDTO]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
}
export class OrganizationStore implements IOrganizationStore {
    getStores: () => IStores;
    api: IApi;
    services: IServices;

    collection: ICollectionModel<IOrganization, IOrganizationValue>;
    list: IListModel<IOrganization, IOrganizationValue>;

    constructor(params: IOrganizationStoreParams) {
        this.getStores = params.getStores;
        this.api = params.api;
        this.services = params.services;

        this.collection = new CollectionModel<IOrganization, IOrganizationValue>({ factory: data => new Organization(data, this) });
        this.list = new ListModel<IOrganization, IOrganizationValue>(this);

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateOrganizationDTO) => {
            const res = await this.api.organization.create(createOrganizationDTO(data));
            this.list.unshift(createOrganization(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.organization.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.organization.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createOrganization));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.organization.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createOrganization));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.organization.get(id);

            if (!res) return;

            const value = createOrganization(res);

            this.collection.set(value.id, value);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
