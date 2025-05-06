import { makeAutoObservable, reaction } from 'mobx';
import { type COMMENT_TYPE } from 'shared-my';
import { type IRequestModel, RequestModel } from 'shared-my-client';

import { CommentModel } from '~/models';
import { ErrorManager } from '~/services';
import { stores } from '~/stores';

export interface ICommentsModel {
    init(params: { id: string }): void;
    load: IRequestModel;
    loadMore: IRequestModel;
    isLoading: boolean;
    isLoadingMore: boolean;
    isEndReached: boolean;
    isComments: boolean;
    isVisibleComments: boolean;
    items?: CommentModel[];
}

export class CommentsModel implements ICommentsModel {
    private entityId: string = '';
    private map: Record<string, CommentModel> = {};

    constructor(private type: COMMENT_TYPE) {
        makeAutoObservable(this);

        reaction(
            () => stores.viewer?.isAuthenticated,
            () => this.load.run(),
        );
    }

    init({ id }: { id: string }) {
        this.entityId = id;
        stores.comment?.create(this.entityId, this.type);
    }

    load = new RequestModel({
        returnIfLoading: true,
        shouldRun: () => stores.viewer?.isAuthenticated,
        run: () => this.comments?.fetchList.run(),
        onError: e => ErrorManager.request(e),
    });

    loadMore = new RequestModel({
        returnIfLoading: true,
        shouldRun: () => stores.viewer?.isAuthenticated,
        run: () => this.comments?.fetchMoreList.run(),
        onError: e => ErrorManager.request(e),
    });

    get comments() {
        if (!this.entityId) return undefined;
        return stores.comment.get(this.entityId, this.type);
    }

    get items() {
        return (
            this.comments?.list.map(el => {
                if (!this.map[el.id]) {
                    this.map[el.id] = new CommentModel(el);
                }

                return this.map[el.id];
            }) ?? []
        );
    }

    get isComments() {
        return !!this.comments?.list.length;
    }

    get isLoading() {
        return !!this.comments?.fetchList.isLoading;
    }

    get isLoadingMore() {
        return !!this.comments?.fetchMoreList.isLoading;
    }

    get isEndReached() {
        return !this.comments?.list.isMorePages;
    }

    get isVisibleComments() {
        return !!stores.viewer?.isAuthenticated;
    }
}
