import { makeAutoObservable } from 'mobx';
import { type IExplosive } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface ISlide {
    uri: string;
    id: number;
}

export interface IExplosiveDetailsVM extends ViewModel {
    item: IExplosive | undefined;
    slides: ISlide[];
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

    get slides() {
        return [this.item?.imageUri, ...(this.item?.data.imageUris ?? [])].filter(Boolean).map((uri, i) => ({ uri, id: i })) as ISlide[];
    }
}

export const explosiveDetailsVM = new ExplosiveDetailsVM();
