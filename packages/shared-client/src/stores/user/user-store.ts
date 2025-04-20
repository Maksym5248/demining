import { makeAutoObservable } from 'mobx';

import { type IUserAPI } from '~/api';
import { dates } from '~/common';
import { CollectionModel, type IRequestModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { createUser, type IUser, type IUserData, User } from './entities';

export interface IUserStore {
    collection: CollectionModel<IUser, IUserData>;
    listUnassigned: ListModel<IUser, IUserData>;
    list: ListModel<IUser, IUserData>;
    fetchListUnassigned: RequestModel<[search?: string]>;
    fetchListUnassignedMore: RequestModel<[search?: string]>;
    fetchList: IRequestModel<[string | undefined]>;
    fetchMoreList: IRequestModel<[string | undefined]>;
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

    collection = new CollectionModel<IUser, IUserData>({ factory: data => new User(data, { api: this.api, services: this.services }) });
    listUnassigned = new ListModel<IUser, IUserData>(this);
    list = new ListModel<IUser, IUserData>(this);

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    fetchListUnassigned = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.user.getList({
                search,
                limit: this.listUnassigned.pageSize,
                where: {
                    organizationId: null,
                },
            });

            this.listUnassigned.set(res.map(createUser));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchListUnassignedMore = new RequestModel({
        shouldRun: () => this.listUnassigned.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.user.getList({
                search,
                limit: this.listUnassigned.pageSize,
                startAfter: dates.toDateServer(this.listUnassigned.last.data.createdAt),
                where: {
                    organizationId: null,
                },
            });

            this.listUnassigned.push(res.map(createUser));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchList = new RequestModel({
        run: async (search: string | undefined) => {
            const res = await this.api.user.getList({
                search,
                limit: this.list.pageSize,
            });
            this.list.set(res.map(createUser));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        run: async (search: string | undefined) => {
            const res = await this.api.user.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });
            this.list.push(res.map(createUser));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
