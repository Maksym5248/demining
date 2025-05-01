import { makeAutoObservable } from 'mobx';
import { type IExplosive, type IExplosiveObject, type IFillerData } from 'shared-my-client';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';

export interface ICharacteristicModel {
    fillers: ({ explosive: IExplosive | undefined } & IFillerData)[] | undefined;
    fuses: IExplosiveObject[] | undefined;
    fervor: IExplosiveObject[] | undefined;
    openExplosive(id: string): void;
    init({ id }: { id: string }): void;
}

export class CharacteristicModel implements ICharacteristicModel {
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
        return stores.explosiveObject.collection.get(this.currentId);
    }

    get fillers() {
        return this.item?.details?.data?.filler?.map(item => ({
            ...item,
            explosive: stores.explosive.collection.get(item.explosiveId ?? undefined),
        }));
    }

    get fuses() {
        return (this.item?.details?.data?.fuseIds?.map(item => stores.explosiveObject.collection.get(item)) as IExplosiveObject[]) ?? [];
    }

    get fervor() {
        return (this.item?.details?.data?.fervorIds?.map(item => stores.explosiveObject.collection.get(item)) as IExplosiveObject[]) ?? [];
    }
}
