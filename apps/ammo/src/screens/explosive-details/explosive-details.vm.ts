import { makeAutoObservable } from 'mobx';
import { type IExplosiveCompositionData, type IExplosive } from 'shared-my-client';

import { type ISlide } from '~/components';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IExplosiveDetailsVM extends ViewModel {
    item: IExplosive | undefined;
    slides: ISlide[];
    composition: ({ explosive: IExplosive | undefined } & IExplosiveCompositionData)[] | undefined;
}

export class ExplosiveDetailsVM implements IExplosiveDetailsVM {
    currentId?: string = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    init({ id }: { id: string }) {
        this.currentId = id;
    }

    get item() {
        return stores.explosive.collection.get(this.currentId);
    }

    get composition() {
        return this.item?.data?.composition?.map(item => ({
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
}

const vms: Record<string, ExplosiveDetailsVM> = {};

export const createVM = (id: string = 'default') => {
    if (vms[id]) return vms[id];
    vms[id] = new ExplosiveDetailsVM();
    return vms[id];
};
