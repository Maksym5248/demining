import { makeAutoObservable } from 'mobx';
import { type IExplosiveCompositionData, type IExplosive } from 'shared-my-client';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';

export interface IDetailsModel {
    composition: ({ explosive: IExplosive | undefined } & IExplosiveCompositionData)[] | undefined;
    openExplosive(id: string): void;
    init({ id }: { id: string }): void;
}

export class DetailsModel implements IDetailsModel {
    currentId?: string = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    init({ id }: { id: string }) {
        this.currentId = id;
    }

    openExplosive(id: string) {
        Navigation.push(SCREENS.EXPLOSIVE_DETAILS, { id });
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
}
