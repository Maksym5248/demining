import { makeAutoObservable } from 'mobx';
import { type COMMENT_TYPE } from 'shared-my';

import { CommentModel } from '~/models';
import { stores } from '~/stores';

export interface ICommentsModel {
    init(params: { id: string }): void;
    load(): void;
    loadMore(): void;
    isLoading: boolean;
    isLoadingMore: boolean;
    isEndReached: boolean;
    isComments: boolean;
    items?: CommentModel[];
}

export class CommentsModel implements ICommentsModel {
    private entityId: string = '';

    constructor(private type: COMMENT_TYPE) {
        makeAutoObservable(this);
    }

    init({ id }: { id: string }) {
        this.entityId = id;
        stores.comment?.create(this.entityId, this.type);
        this.comments?.fetchList.run();
    }

    load() {
        if (!stores.viewer?.isAuthenticated) return;
        this.comments?.fetchList.run();
    }

    loadMore() {
        if (!stores.viewer?.isAuthenticated) return;
        this.comments?.fetchMoreList.run();
    }

    get comments() {
        if (!this.entityId) return undefined;
        return stores.comment.get(this.entityId, this.type);
    }

    get items() {
        return this.comments?.list.map(el => new CommentModel(el)) ?? [];
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
}
