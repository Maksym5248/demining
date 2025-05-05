import { makeAutoObservable } from 'mobx';
import { dates, type IComment } from 'shared-my-client';

import { MODALS } from '~/constants';
import { Modal } from '~/services';

export interface ICommentModel {
    openGallery: (index: number) => void;
    like: () => void;
    dislike: () => void;
    id: string;
    photoUri: string | undefined;
    title?: string;
    text: string;
    imageUris: string[];
    dislikesCount: number;
    likesCount: number;
    replyCount: number;
    isLiked: boolean;
    isDisliked: boolean;
    isReply: boolean;
    createAt: string;
}

export class CommentModel implements ICommentModel {
    constructor(public item: IComment) {
        makeAutoObservable(this);
    }

    openGallery = (index: number) => {
        Modal.show(MODALS.GALLERY, { images: this.item.data.imageUris.map(uri => ({ uri })), index });
    };

    like = () => {
        this.item.like.run();
    };
    dislike = () => {
        this.item.dislike.run();
    };

    get id() {
        return this.item.id;
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

    get dislikesCount() {
        return this.item.dislikesCount;
    }

    get likesCount() {
        return this.item.likesCount;
    }

    get replyCount() {
        return this.item.likesCount;
    }

    get isLiked() {
        return this.item.isLiked;
    }

    get isDisliked() {
        return this.item.isDisliked;
    }

    get isReply() {
        return this.item.isReply;
    }

    get createAt() {
        return dates.format(this.item.createdAt, 'YYYY-MM-DD HH:mm');
    }
}
