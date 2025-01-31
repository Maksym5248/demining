import { makeAutoObservable } from 'mobx';
import { type IExplosiveDevice, type IExplosive, type IFillerData } from 'shared-my-client';

import { type ISlide } from '~/components';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IExplosiveObjectDetailsVM extends ViewModel {
    item: IExplosiveDevice | undefined;
    slides: ISlide[];
    slidesPurpose: ISlide[];
    slidesStructure: ISlide[];
    slidesAction: ISlide[];
    fillers: ({ explosive: IExplosive | undefined } & IFillerData)[] | undefined;
}

export class ExplosiveObjectDetailsVM implements IExplosiveObjectDetailsVM {
    currentId?: string = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    init({ id }: { id: string }) {
        this.currentId = id;
    }

    get item() {
        return stores.explosiveDevice.collection.get(this.currentId);
    }

    get fillers() {
        return this.item?.data?.filler?.map(item => ({
            ...item,
            explosive: stores.explosive.collection.get(item.explosiveId ?? undefined),
        }));
    }

    get slides() {
        return (
            [this.item?.imageUri, ...(this.item?.data.imageUris ?? [])].filter(Boolean).map((uri, i) => ({ uri, id: i }) as ISlide) ??
            ([] as ISlide[])
        );
    }

    get slidesPurpose() {
        return this.item?.data.purpose?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesStructure() {
        return this.item?.data.structure?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesAction() {
        return this.item?.data.action?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }
}

const vms: Record<string, ExplosiveObjectDetailsVM> = {};

export const createVM = (id: string = 'default') => {
    if (vms[id]) return vms[id];
    vms[id] = new ExplosiveObjectDetailsVM();
    return vms[id];
};
