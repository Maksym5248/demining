import { makeAutoObservable } from 'mobx';
import { type COMMENT_TYPE } from 'shared-my';

import { type ICommentAPI } from '~/api';
import { CollectionModel } from '~/models';

import { Comments, type IComments } from './comments';
import { type IComment, type ICommentData, Comment } from './entities';
import { type IUserStore } from '../user';
import { type IViewerStore } from '../viewer';

export interface ICommentStore {
    create(id: string, type: COMMENT_TYPE): void;
    get(id: string, type: COMMENT_TYPE): IComments | undefined;
}

interface IApi {
    comment: ICommentAPI;
}

interface IStores {
    user: IUserStore;
    viewer: IViewerStore;
}

const createID = (id: string, type: COMMENT_TYPE) => `${type}-${id}`;

export class CommentStore implements ICommentStore {
    api: IApi;
    getStores: () => IStores;

    collection = new CollectionModel<IComment, ICommentData>({
        factory: (data: ICommentData) => new Comment(data, this),
    });

    map: Record<string, Comments> = {};

    constructor(params: { api: IApi; getStores: () => IStores }) {
        this.api = params.api;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    create(id: string, type: COMMENT_TYPE) {
        const key = createID(id, type);

        if (this.map[key]) {
            return this.map[key];
        }

        this.map[key] = new Comments({
            entityId: id,
            type,
            api: this.api,
            collection: this.collection,
            getStores: () => ({
                user: this.getStores().user,
            }),
        });
    }

    get(id: string, type: COMMENT_TYPE) {
        const key = createID(id, type);
        return this.map[key];
    }
}
