import { trim } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { type COMMENT_TYPE, ERROR_MESSAGE } from 'shared-my';
import { type IRequestModel, RequestModel } from 'shared-my-client';

import { AssetStorage, ErrorManager, ImagePicker } from '~/services';
import { type IGalleryImage } from '~/services';
import { stores } from '~/stores';

export interface ICommentInputModel {
    onChangeValue(value: string): void;
    setFocused(value: boolean): void;
    removeImages(): void;
    init(params: { id: string }): void;
    clear(): void;
    openGallery: IRequestModel;
    submit: IRequestModel;
    value: string;
    imagesUris: string[];
    isDisabled: boolean;
    isFocused: boolean;
    isSelectedImages: boolean;
    countSelectedImages: number;
    isVisible: boolean;
    isLoading: boolean;
}

export class CommentInputModel implements ICommentInputModel {
    value = '';
    imagesUris: string[] = [];
    images: IGalleryImage[] = [];
    entityId: string = '';
    isFocused = false;

    constructor(private type: COMMENT_TYPE) {
        makeAutoObservable(this);
    }

    init(params: { id: string }) {
        this.entityId = params.id;
    }

    get comments() {
        return stores.comment.get(this.entityId, this.type);
    }

    onChangeValue(value: string) {
        this.value = value;
    }

    setFocused(value: boolean) {
        this.isFocused = value;
    }

    setImages(uris: IGalleryImage[]) {
        this.images = uris;
    }

    setImageUris(uris: string[]) {
        this.imagesUris = uris;
    }

    clear() {
        this.value = '';
        this.images = [];
        this.imagesUris = [];
        this.isFocused = false;
    }

    removeImages() {
        this.images = [];
    }

    openGallery = new RequestModel({
        run: async () => {
            try {
                const res = await ImagePicker.selectImage({
                    multiple: true,
                });
                this.setImages(res);
            } catch (e) {
                ErrorManager.request(e);
            }
        },
    });

    async uploadImages() {
        if (!this.images.length) return [];

        const uris = await Promise.allSettled(this.images.map(el => AssetStorage.image.create(el.path)));

        try {
            const rejected = uris.filter(el => el.status === 'rejected');

            if (rejected.length) {
                throw new Error(ERROR_MESSAGE.SOME_IMAGES_NOT_UPLOADED);
            }
        } catch (e) {
            ErrorManager.request(e);
        }

        const succused = uris.filter(el => el.status === 'fulfilled').map(el => (el as PromiseFulfilledResult<string>)?.value);

        return succused;
    }

    submit = new RequestModel({
        returnIfLoading: true,
        run: async () => {
            try {
                const imageUris = await this.uploadImages();
                const values = { text: this.value, imageUris, parentId: null };
                await this.comments?.create.run(values);
                this.clear();
            } catch (e) {
                console.log('ERROR', e);
                ErrorManager.request(e);
            }
        },
    });

    get isDisabled() {
        return !this.images.length && !trim(this.value);
    }

    get isSelectedImages() {
        return this.images.length > 0;
    }

    get countSelectedImages() {
        return this.images.length;
    }

    get isLoading() {
        return this.submit.isLoading;
    }

    get isVisible() {
        return !!stores.viewer.isAuthenticated;
    }
}
