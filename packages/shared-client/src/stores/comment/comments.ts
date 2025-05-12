import { makeAutoObservable } from 'mobx';
import { type COMMENT_TYPE } from 'shared-my';

import { type ICommentAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { type CollectionModel, type IListModel, type IRequestModel, ListModel, RequestModel } from '~/models';

import { type IComment, type ICommentData, type ICreateCommentData, createComment, createCommentDTO } from './entities';
import { createUser, type IUserStore } from '../user';

export interface IComments {
    list: IListModel<IComment, ICommentData>;
    create: IRequestModel<[ICreateValue<ICreateCommentData>]>;
    remove: IRequestModel<[string]>;
    fetchList: IRequestModel;
    fetchMoreList: IRequestModel;
}

interface IApi {
    comment: ICommentAPI;
}

interface IStores {
    user: IUserStore;
}

interface IServices {
    localization: {
        data: {
            locale: string;
        };
    };
}

export class Comments implements IComments {
    entityId: string;
    type: COMMENT_TYPE;

    api: IApi;
    collection: CollectionModel<IComment, ICommentData>;
    list: IListModel<IComment, ICommentData>;
    getStores: () => IStores;
    services: IServices;

    constructor(params: {
        entityId: string;
        type: COMMENT_TYPE;
        api: IApi;
        collection: CollectionModel<IComment, ICommentData>;
        getStores: () => IStores;
        services: IServices;
    }) {
        this.entityId = params.entityId;
        this.type = params.type;
        this.services = params.services;

        this.collection = params.collection;
        this.api = params.api;
        this.getStores = params.getStores;

        this.list = new ListModel<IComment, ICommentData>({ collection: this.collection });

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<ICreateCommentData>) => {
            console.log('create comment 1', data);
            const res = await this.api.comment.create(
                createCommentDTO({
                    ...data,
                    originalLang: this.services.localization.data.locale,
                    type: this.type,
                    entityId: this.entityId,
                }),
            );
            this.list.unshift(createComment(res));
        },
    });

    remove = new RequestModel({
        run: async (id: string) => {
            this.list.remove(id);
            await this.api.comment.remove(id);
        },
    });

    fetchList = new RequestModel({
        run: async () => {
            const res = await this.api.comment.getList({
                where: {
                    entityId: this.entityId,
                    type: this.type,
                },
                limit: this.list.pageSize,
            });

            this.getStores().user.collection.set(res.map(el => createUser(el.author)));
            this.list.set(res.map(createComment));
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages && !this.fetchList.isLoading,
        run: async () => {
            const res = await this.api.comment.getList({
                where: {
                    entityId: this.entityId,
                    type: this.type,
                },
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.getStores().user.collection.set(res.map(el => createUser(el.author)));
            this.list.push(res.map(createComment));
        },
    });
}
