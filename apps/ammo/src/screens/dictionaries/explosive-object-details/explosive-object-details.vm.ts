import { makeAutoObservable } from 'mobx';
import { type IExplosiveObject } from 'shared-my-client';

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
    slidesMarking: ISlide[];
    slidesPurpose: ISlide[];
    slidesHistorical: ISlide[];
    slidesStructure: ISlide[];
    slidesAction: ISlide[];
    slidesInstallation: ISlide[];
    slidesLiquidator: ISlide[];
    slidesExtraction: ISlide[];
    slidesFolding: ISlide[];
    slidesNeutralization: ISlide[];
    characteristic: ICharacteristicModel;
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

    get slidesMarking() {
        return this.item?.details?.data.marking?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesPurpose() {
        return this.item?.details?.data.purpose?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesStructure() {
        return this.item?.details?.data.structure?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesInstallation() {
        return this.item?.details?.data.installation?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesLiquidator() {
        return this.item?.details?.data.liquidator?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesExtraction() {
        return this.item?.details?.data.extraction?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesFolding() {
        return this.item?.details?.data.folding?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesNeutralization() {
        return this.item?.details?.data.neutralization?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesAction() {
        return this.item?.details?.data.action?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }

    get slidesHistorical() {
        return this.item?.details?.data.historical?.imageUris.map((uri, i) => ({ uri, id: i })) ?? ([] as ISlide[]);
    }
}

const vms: Record<string, ExplosiveObjectDetailsVM> = {};

export const createVM = (id: string = 'default') => {
    if (vms[id]) return vms[id];
    vms[id] = new ExplosiveObjectDetailsVM();
    return vms[id];
};
