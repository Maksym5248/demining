import { makeAutoObservable } from 'mobx';

import { type ICommentAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { type CollectionModel, type IListModel, ListModel, RequestModel } from '~/models';

import { type IComment, type ICommentData, createComment, createCommentDTO } from './entities';
import { createUser, type IUserStore } from '../user';

export interface IComments {
    list: IListModel<IComment, ICommentData>;
    create: RequestModel<[ICreateValue<ICommentData>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
}

interface IApi {
    comment: ICommentAPI;
}

interface IStores {
    user: IUserStore;
}

export class Comments implements IComments {
    api: IApi;

    collection: CollectionModel<IComment, ICommentData>;
    list: IListModel<IComment, ICommentData>;
    getStores: () => IStores;

    constructor(params: { api: IApi; collection: CollectionModel<IComment, ICommentData>; getStores: () => IStores }) {
        makeAutoObservable(this);

        this.collection = params.collection;
        this.api = params.api;
        this.getStores = params.getStores;

        this.list = new ListModel<IComment, ICommentData>({ collection: this.collection });

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<ICommentData>) => {
            const res = await this.api.comment.create(createCommentDTO(data));
            this.list.unshift(createComment(res));
        },
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.comment.remove(id);
            this.collection.remove(id);
        },
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.comment.getList({
                search,
                limit: this.list.pageSize,
            });

            this.getStores().user.collection.set(res.map(el => createUser(el.author)));
            this.list.set(res.map(createComment));
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.comment.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.getStores().user.collection.set(res.map(el => createUser(el.author)));
            this.list.push(res.map(createComment));
        },
    });
}
