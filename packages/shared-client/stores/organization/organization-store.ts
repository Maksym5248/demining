import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { type IOrganizationAPI, type ICreateOrganizationDTO, type IOrganizationDTO } from '~/api';
import { dates } from '~/common';
import { CollectionModel, type ICollectionModel, type IListModel, ListModel, RequestModel } from '~/models';

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

interface IOrganizationStoreParams {
    stores: {
        viewer: IViewerStore;
        user: IUserStore;
    };
    api: IApi;
}

export interface IOrganizationStore {
    collection: ICollectionModel<IOrganization, IOrganizationValue>;
    list: IListModel<IOrganization, IOrganizationValue>;
    searchList: IListModel<IOrganization, IOrganizationValue>;
    append(res: IOrganizationDTO[], isSearch: boolean, isMore?: boolean): void;
    create: RequestModel<[ICreateOrganizationDTO]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
}
export class OrganizationStore implements IOrganizationStore {
    stores: {
        viewer: IViewerStore;
        user: IUserStore;
    };
    api: IApi;
    collection: ICollectionModel<IOrganization, IOrganizationValue>;
    list: IListModel<IOrganization, IOrganizationValue>;
    searchList: IListModel<IOrganization, IOrganizationValue>;

    constructor(params: IOrganizationStoreParams) {
        this.stores = params.stores;
        this.api = params.api;

        this.collection = new CollectionModel<IOrganization, IOrganizationValue>({ factory: (data) => new Organization(data, this) });
        this.list = new ListModel<IOrganization, IOrganizationValue>(this);
        this.searchList = new ListModel<IOrganization, IOrganizationValue>(this);
        makeAutoObservable(this);
    }

    append(res: IOrganizationDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createOrganization), true);
    }

    create = new RequestModel({
        run: async (data: ICreateOrganizationDTO) => {
            const res = await this.api.organization.create(createOrganizationDTO(data));
            this.list.unshift(createOrganization(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.organization.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
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

            const res = await this.api.organization.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Виникла помилка'),
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

            const res = await this.api.organization.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.organization.get(id);

            if (!res) return;

            const value = createOrganization(res);

            this.collection.set(value.id, value);
        },
        onError: () => message.error('Виникла помилка'),
    });
}
