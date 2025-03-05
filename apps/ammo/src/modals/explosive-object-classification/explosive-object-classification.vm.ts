import { makeAutoObservable } from 'mobx';

import { ClassificationExplosiveObject, type IClassificationExplosiveObject, type IClassificationItem } from '~/models';
import { type ViewModel } from '~/types';

export interface IExplosiveObjectClassificationVM extends ViewModel {
    asArray: IClassificationItem[];
}

export class ExplosiveObjectClassificationVM implements IExplosiveObjectClassificationVM {
    classification: IClassificationExplosiveObject = new ClassificationExplosiveObject();

    constructor() {
        makeAutoObservable(this);
    }

    init({ typeId, classItemId }: { typeId: string; classItemId?: string[] }) {
        typeId && this.classification.setType(typeId);

        classItemId?.forEach(id => {
            this.classification.get(id)?.setSelected(true);
        });
    }

    unmount() {
        this.classification.clearType();
    }

    get asArray() {
        return this.classification.asArray;
    }
}

export const explosiveObjectClassificationVM = new ExplosiveObjectClassificationVM();
