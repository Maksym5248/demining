import { makeAutoObservable } from 'mobx';
import { COMMENT_TYPE } from 'shared-my';
import { type IExplosiveDevice } from 'shared-my-client';

import { type ISlide } from '~/components';
import {
    CommentInputModel,
    CommentsModel,
    type ICommentInputModel,
    type ICommentsModel,
    SectionCarouselModel,
    type ISectionCarouselModel,
} from '~/models';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { CharacteristicModel, type ICharacteristicModel } from './models';

export interface IExplosiveObjectDetailsVM extends ViewModel {
    item: IExplosiveDevice | undefined;
    slides: ISlide[];
    marking: ISectionCarouselModel;
    purpose: ISectionCarouselModel;
    structure: ISectionCarouselModel;
    action: ISectionCarouselModel;
    characteristic: ICharacteristicModel;
    comments: ICommentsModel;
    input: ICommentInputModel;
}

export class ExplosiveObjectDetailsVM implements IExplosiveObjectDetailsVM {
    currentId?: string = undefined;
    characteristic: ICharacteristicModel;
    comments = new CommentsModel(COMMENT_TYPE.EXPLOSIVE_DEVICE);
    input = new CommentInputModel(COMMENT_TYPE.EXPLOSIVE_DEVICE);

    constructor() {
        this.characteristic = new CharacteristicModel();
        makeAutoObservable(this);
    }

    init({ id }: { id: string }) {
        this.currentId = id;
        this.characteristic.init({ id });
        this.comments.init({ id });
        this.input.init({ id });
    }

    unmount() {
        this.input.clear();
    }

    get item() {
        return stores.explosiveDevice.collection.get(this.currentId);
    }

    get slides() {
        return (
            [this.item?.imageUri, ...(this.item?.data.imageUris ?? [])].filter(Boolean).map((uri, i) => ({ uri, id: i }) as ISlide) ??
            ([] as ISlide[])
        );
    }

    get marking() {
        return new SectionCarouselModel(
            this.item?.data.marking?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.data.marking?.description as string,
        );
    }

    get purpose() {
        return new SectionCarouselModel(
            this.item?.data.purpose?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.data.purpose?.description as string,
        );
    }

    get structure() {
        return new SectionCarouselModel(
            this.item?.data.structure?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.data.structure?.description as string,
        );
    }

    get action() {
        return new SectionCarouselModel(
            this.item?.data.action?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.data.action?.description as string,
        );
    }
}

const vms: Record<string, ExplosiveObjectDetailsVM> = {};

export const createVM = (id: string = 'default') => {
    if (vms[id]) return vms[id];
    vms[id] = new ExplosiveObjectDetailsVM();
    return vms[id];
};
