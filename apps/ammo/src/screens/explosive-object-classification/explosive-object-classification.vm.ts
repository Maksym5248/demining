import { makeAutoObservable } from 'mobx';
import { TypeNodeClassification } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { DataItem, type IDataItem } from './data-item.model';

export interface IExplosiveObjectClassificationVM extends ViewModel {
    asArray: IDataItem[];
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
        const items = stores.explosiveObject.classifications.flattenSectionsSimple(this.typeId);
        const lastRootIndex = items.findLastIndex(item => item.type === TypeNodeClassification.Class);

        return items.map((item, i) => {
            const next = items[i + 1];
            const isLast = !next || next.deep < item.deep || next.type === TypeNodeClassification.Class;
            const isLastRoot = lastRootIndex ? i > lastRootIndex : false;
            const isNextLastRoot = lastRootIndex ? i + 1 > lastRootIndex : false;
            return new DataItem(item, isLast, isLastRoot, isNextLastRoot);
        });
    }
}

export const explosiveObjectClassificationVM = new ExplosiveObjectClassificationVM();
