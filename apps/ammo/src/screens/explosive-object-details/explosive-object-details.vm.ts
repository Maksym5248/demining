import { makeAutoObservable } from 'mobx';
import { type IExplosive, type IExplosiveObject, type IFillerData } from 'shared-my-client';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface ISlide {
    uri: string;
    id: number;
}

export interface IExplosiveObjectDetailsVM extends ViewModel {
    item: IExplosiveObject | undefined;
    slides: ISlide[];
    slidesMarking: ISlide[];
    slidesPurpose: ISlide[];
    slidesStructure: ISlide[];
    slidesAction: ISlide[];
    slidesInstallation: ISlide[];
    slidesLiquidator: ISlide[];
    slidesExtraction: ISlide[];
    slidesFolding: ISlide[];
    slidesNeutralization: ISlide[];
    fillers: ({ explosive: IExplosive | undefined } & IFillerData)[] | undefined;
    fuses: IExplosiveObject[];
    fervor: IExplosiveObject[];
    openExplosive(id: string): void;
    openExplosiveObject(id: string): void;
}

export class ExplosiveObjectDetailsVM implements IExplosiveObjectDetailsVM {
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

    openExplosiveObject(id: string) {
        Navigation.push(SCREENS.EXPLOSIVE_OBJECT_DETAILS, { id });
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
}

const vms: Record<string, ExplosiveObjectDetailsVM> = {};

export const createVM = (id: string = 'default') => {
    if (vms[id]) return vms[id];
    vms[id] = new ExplosiveObjectDetailsVM();
    return vms[id];
};
