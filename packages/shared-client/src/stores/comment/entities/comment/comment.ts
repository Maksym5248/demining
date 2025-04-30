import { makeAutoObservable } from 'mobx';

import { type ICommentAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, RequestModel } from '~/models';
import { type IUser } from '~/stores/user';

import { type ICommentData, updateCommentDTO } from './comment.schema';
import { type IUserStore } from '../../../user/user-store';

export interface IComment extends IDataModel<ICommentData> {
    updateFields: (data: Partial<ICommentData>) => void;
    update: RequestModel<[IUpdateValue<ICommentData>]>;
    author: IUser | undefined;
}

interface IApi {
    comment: ICommentAPI;
}

interface IStores {
    users: IUserStore;
}

interface ICommentParams {
    api: IApi;
    getStores: () => IStores;
}

export class Comment implements IComment {
    api: IApi;
    data: ICommentData;
    getStores: () => IStores;

    constructor(data: ICommentData, params: ICommentParams) {
        this.data = data;
        this.api = params.api;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get author() {
        return this.getStores().users.collection.get(this.data.authorId);
    }

    updateFields(data: Partial<ICommentData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<ICommentData>) => {
            await this.api.comment.update(this.data.id, updateCommentDTO(data));
            this.updateFields(data);
        },
    });
}
