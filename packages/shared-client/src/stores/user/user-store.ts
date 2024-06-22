import { makeAutoObservable } from 'mobx';

import { type IUserAPI, type IUserDTO } from '~/api';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { createUser, type IUser, type IUserData, User } from './entities';

export interface IUserStore {
    collection: CollectionModel<IUser, IUserData>;
    listUnassigned: ListModel<IUser, IUserData>;
    searchListUnassigned: ListModel<IUser, IUserData>;
    fetchListUnassigned: RequestModel<[search?: string]>;
    fetchListUnassignedMore: RequestModel<[search?: string]>;
}

interface IApi {
    user: IUserAPI;
}

interface IServices {
    message: IMessage;
}

export class UserStore implements IUserStore {
    api: IApi;
    services: IServices;

    collection = new CollectionModel<IUser, IUserData>({ model: User });
    listUnassigned = new ListModel<IUser, IUserData>(this);
    searchListUnassigned = new ListModel<IUser, IUserData>(this);

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    append(res: IUserDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchListUnassigned : this.listUnassigned;
        if (isSearch && !isMore) this.searchListUnassigned.clear();

        list.checkMore(res.length);
        list.push(res.map(createUser), true);
    }

    fetchListUnassigned = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            return !(!isSearch && list.length);
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            const res = await this.api.user.getListUnassignedUsers({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchListUnassignedMore = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            return list.isMorePages;
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            const res = await this.api.user.getListUnassignedUsers({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.data.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
