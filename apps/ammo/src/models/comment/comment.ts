import { makeAutoObservable } from 'mobx';
import { type IComment } from 'shared-my-client';

export interface ICommentModel {
    item: IComment;
    photoUri: string | undefined;
    title?: string;
    text: string;
    imageUris: string[];
}

export class CommentModel implements ICommentModel {
    constructor(public item: IComment) {
        makeAutoObservable(this);
    }

    get photoUri() {
        return this.item.author?.photoUri;
    }

    get title() {
        return this.item.author?.displayName ?? 'unknown';
    }

    get text() {
        return this.item.data.text;
    }

    get imageUris() {
        return this.item.data.imageUris;
    }
}
