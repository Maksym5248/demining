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
    likesCount: number;
    dislikesCount: number;
    replyCount: number;
    isReply: boolean;
    isMy: boolean;
}

interface IApi {
    comment: ICommentAPI;
}

interface IStores {
    user: IUserStore;
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
        return this.isMy ? this.getStores().viewer.user?.asUser : this.getStores().user.collection.get(this.data.authorId);
    }

    get isMy() {
        const id = this.getStores().viewer.user?.id;
        return id ? this.data.authorId === id : false;
    }

    updateFields(data: Partial<ICommentData>) {
        Object.assign(this.data, data);
    }

    get createdAt() {
        return this.data.createdAt;
    }

    get likesCount() {
        return this.data.likes.length;
    }

    get dislikesCount() {
        return this.data.dislikes.length;
    }

    get replyCount() {
        return this.data.replyCount;
    }

    get isLiked() {
        const id = this.getStores().viewer.user?.id;
        return id ? this.data.likes.includes(id) : false;
    }

    get isDisliked() {
        const id = this.getStores().viewer.user?.id;
        return id ? this.data.dislikes.includes(id) : false;
    }

    get isReply() {
        return this.data.replyCount > 0;
    }

    like = new RequestModel({
        run: async () => {
            const id = this.getStores().viewer.user?.id;

            if (!id) {
                throw new Error('User not found');
            }

            if (this.isMy) {
                return;
            }

            if (this.isLiked) {
                this.data.likes = this.data.likes.filter(id => id !== id);

                await this.api.comment.update(this.data.id, {
                    likes: [...this.data.likes, id],
                });
            } else {
                this.data.likes.push(id);
                this.data.dislikes = this.data.dislikes.filter(id => id !== id);

                await this.api.comment.update(this.data.id, {
                    likes: this.data.likes,
                    dislikes: this.data.dislikes,
                });
            }
        },
    });

    dislike = new RequestModel({
        run: async () => {
            const id = this.getStores().viewer.user?.id;

            if (!id) {
                throw new Error('User not found');
            }

            if (this.isMy) {
                return;
            }

            if (this.isDisliked) {
                this.data.dislikes = this.data.dislikes.filter(id => id !== id);

                await this.api.comment.update(this.data.id, {
                    dislikes: [...this.data.dislikes, id],
                });
            } else {
                this.data.dislikes.push(id);
                this.data.likes = this.data.likes.filter(id => id !== id);

                await this.api.comment.update(this.data.id, {
                    dislikes: [...this.data.dislikes, id],
                    likes: this.data.likes.filter(id => id !== id),
                });
            }
        },
    });
}
