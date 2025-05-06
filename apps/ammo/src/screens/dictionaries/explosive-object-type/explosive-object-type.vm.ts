import { makeAutoObservable } from 'mobx';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { DataItem, type IDataItem } from './data-item.model';

export interface IExplosiveObjectTypeVM extends ViewModel {
    asArray: IDataItem[];
}

export class ExplosiveObjectTypeVM implements IExplosiveObjectTypeVM {
    constructor() {
        makeAutoObservable(this);
    }

    get asArray() {
        return stores.explosiveObject.type.list.map(item => new DataItem(item));
    }
}

export const explosiveObjectTypeVM = new ExplosiveObjectTypeVM();
