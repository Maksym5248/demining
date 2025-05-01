import { makeAutoObservable } from 'mobx';
import { type IExplosiveObject } from 'shared-my-client';

import { type ISectionCarouselModel, SectionCarouselModel } from '~/models';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { CharacteristicModel, type ICharacteristicModel } from './models/characteristic.model';

export interface ISlide {
    uri: string;
    id: number;
}

export interface IExplosiveObjectDetailsVM extends ViewModel {
    item: IExplosiveObject | undefined;
    slides: ISlide[];
    characteristic: ICharacteristicModel;
    marking: ISectionCarouselModel;
    purpose: ISectionCarouselModel;
    historical: ISectionCarouselModel;
    structure: ISectionCarouselModel;
    action: ISectionCarouselModel;
    installation: ISectionCarouselModel;
    liquidator: ISectionCarouselModel;
    extraction: ISectionCarouselModel;
    folding: ISectionCarouselModel;
    neutralization: ISectionCarouselModel;
}

export class ExplosiveObjectDetailsVM implements IExplosiveObjectDetailsVM {
    currentId?: string = undefined;
    characteristic: ICharacteristicModel;

    constructor() {
        this.characteristic = new CharacteristicModel();
        makeAutoObservable(this);
    }

    init({ id }: { id: string }) {
        this.currentId = id;
        this.characteristic.init({ id });
    }

    get item() {
        return stores.explosiveObject.collection.get(this.currentId);
    }

    get slides() {
        return (
            [this.item?.imageUri, ...(this.item?.details?.data.imageUris ?? [])]
                .filter(Boolean)
                .map((uri, i) => ({ uri, id: i }) as ISlide) ?? ([] as ISlide[])
        );
    }

    get historical() {
        return new SectionCarouselModel(
            this.item?.details?.data.historical?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.historical?.description as string,
        );
    }

    get marking() {
        return new SectionCarouselModel(
            this.item?.details?.data.marking?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.marking?.description as string,
        );
    }

    get purpose() {
        return new SectionCarouselModel(
            this.item?.details?.data.purpose?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.purpose?.description as string,
        );
    }

    get structure() {
        return new SectionCarouselModel(
            this.item?.details?.data.structure?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.structure?.description as string,
        );
    }

    get installation() {
        return new SectionCarouselModel(
            this.item?.details?.data.installation?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.installation?.description as string,
        );
    }

    get action() {
        return new SectionCarouselModel(
            this.item?.details?.data.action?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.action?.description as string,
        );
    }

    get liquidator() {
        return new SectionCarouselModel(
            this.item?.details?.data.liquidator?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.liquidator?.description as string,
        );
    }

    get extraction() {
        return new SectionCarouselModel(
            this.item?.details?.data.extraction?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.extraction?.description as string,
        );
    }

    get folding() {
        return new SectionCarouselModel(
            this.item?.details?.data.folding?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.folding?.description as string,
        );
    }

    get neutralization() {
        return new SectionCarouselModel(
            this.item?.details?.data.neutralization?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]),
            this.item?.details?.data.neutralization?.description as string,
        ) as unknown as ISectionCarouselModel;
    }
}

const vms: Record<string, ExplosiveObjectDetailsVM> = {};

export const createVM = (id: string = 'default') => {
    if (vms[id]) return vms[id];
    vms[id] = new ExplosiveObjectDetailsVM();
    return vms[id];
};
