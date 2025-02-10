import { makeAutoObservable } from 'mobx';
import { type IExplosive, type IExplosiveDevice, type IExplosiveObject, type INode } from 'shared-my-client';

import { stores } from '~/stores';
import { type DictionaryType, type ViewModel } from '~/types';

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export interface DataItem {
    id: string;
    data: Item;
    type: DictionaryType;
    typeName?: string;
    classItemsNames: string[];
}

export interface IExplosiveObjectClassificationVM extends ViewModel {
    asArray: INode[];
}

export class ExplosiveObjectClassificationVM implements IExplosiveObjectClassificationVM {
    typeId = '';

    constructor() {
        makeAutoObservable(this);
    }

    init({ typeId }: { typeId: string }) {
        typeId && (this.typeId = typeId);
    }

    unmount() {
        this.typeId = '';
    }

    get asArray() {
        return stores.explosiveObject.classifications.flattenSections(this.typeId);
    }
}

export const explosiveObjectClassificationVM = new ExplosiveObjectClassificationVM();
