import { makeAutoObservable } from 'mobx';
import { COMPLAIN_TYPE } from 'shared-my';
import { dates, type IComment } from 'shared-my-client';

import { MODALS, SCREENS } from '~/constants';
import { t } from '~/localization';
import { Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type IOption } from '~/types';

export interface ICommentModel {
    openGallery: (index: number) => void;
    like: () => void;
    dislike: () => void;
    openMenu: () => void;
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

    get comments() {
        return stores.comment.get(this.item.data.entityId, this.item.data.type);
    }

    get menuOptions() {
        return [
            ...(this.item.isMy
                ? [
                      {
                          value: 'delete',
                          title: t('select.delete'),
                      },
                  ]
                : []),
            ...(!this.item.isMy
                ? [
                      {
                          value: 'complain',
                          title: t('select.complain'),
                      },
                  ]
                : []),
        ];
    }

    openMenu = () => {
        Modal.show(MODALS.SELECT, {
            options: this.menuOptions,
            onSelect: (value: IOption<string>) => {
                if (value.value === 'delete') {
                    this.comments?.remove.run(this.id);
                }

                if (value.value === 'complain') {
                    Navigation.push(SCREENS.COMPLAIN, {
                        type: COMPLAIN_TYPE.COMMENT,
                        entityId: this.id,
                    });
                }
            },
        });
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
