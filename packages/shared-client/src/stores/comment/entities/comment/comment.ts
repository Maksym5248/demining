import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { type ICommentAPI } from '~/api';
import { type IDataModel, RequestModel } from '~/models';
import { type IUser } from '~/stores/user';
import { type IViewerStore } from '~/stores/viewer';

import { type ICommentData } from './comment.schema';
import { type IUserStore } from '../../../user/user-store';

export interface IComment extends IDataModel<ICommentData> {
    updateFields: (data: Partial<ICommentData>) => void;
    author: IUser | undefined;
    like: RequestModel<[]>;
    dislike: RequestModel<[]>;
    isLiked: boolean;
    isDisliked: boolean;
    createdAt: Dayjs;
    hasReply: boolean;
    numberLikes: number;
    numberDikes: number;
}

interface IApi {
    comment: ICommentAPI;
}

interface IStores {
    users: IUserStore;
    viewer: IViewerStore;
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

    get createdAt() {
        return this.data.createdAt;
    }

    get numberLikes() {
        return this.data.likes.length;
    }

    get numberDikes() {
        return this.data.dislikes.length;
    }

    get isLiked() {
        const id = this.getStores().viewer.user?.id;
        return id ? this.data.likes.includes(id) : false;
    }

    get isDisliked() {
        const id = this.getStores().viewer.user?.id;
        return id ? this.data.dislikes.includes(id) : false;
    }

    get hasReply() {
        return this.data.replyCount > 0;
    }

    like = new RequestModel({
        run: async () => {
            const id = this.getStores().viewer.user?.id;

            if (!id) {
                throw new Error('User not found');
            }

            if (this.isLiked) {
                return;
            }

            this.data.likes.push(id);
            this.data.dislikes = this.data.dislikes.filter(id => id !== id);

            await this.api.comment.update(this.data.id, {
                likes: this.data.likes,
                dislikes: this.data.dislikes,
            });
        },
    });

    dislike = new RequestModel({
        run: async () => {
            const id = this.getStores().viewer.user?.id;

            if (!id) {
                throw new Error('User not found');
            }

            if (this.isDisliked) {
                return;
            }

            this.data.dislikes.push(id);
            this.data.likes = this.data.likes.filter(id => id !== id);

            await this.api.comment.update(this.data.id, {
                dislikes: [...this.data.dislikes, id],
                likes: this.data.likes.filter(id => id !== id),
            });
        },
    });
}
