import { makeAutoObservable } from 'mobx';
import { type IExplosive } from 'shared-my-client';

import { type ISlide } from '~/components';
import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { DetailsModel, type IDetailsModel } from './models';

export interface IExplosiveDetailsVM extends ViewModel {
    item: IExplosive | undefined;
    slides: ISlide[];
    details: IDetailsModel;
    openExplosive(id: string): void;
}

export class ExplosiveDetailsVM implements IExplosiveDetailsVM {
    currentId?: string = undefined;

    details: IDetailsModel;

    constructor() {
        this.details = new DetailsModel();

        makeAutoObservable(this);
    }

    init({ id }: { id: string }) {
        this.currentId = id;
        this.details.init({ id });
    }

    openExplosive(id: string) {
        Navigation.push(SCREENS.EXPLOSIVE_DETAILS, { id });
    }

    get item() {
        return stores.explosive.collection.get(this.currentId);
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
