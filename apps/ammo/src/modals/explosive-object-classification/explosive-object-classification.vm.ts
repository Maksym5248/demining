import { isArray } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

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

    init({
        typeId,
        classItemId,
        component,
    }: {
        typeId: string;
        classItemId?: string | string[];
        component?: EXPLOSIVE_OBJECT_COMPONENT | EXPLOSIVE_OBJECT_COMPONENT[];
    }) {
        typeId && this.classification.setType(typeId);

        (isArray(classItemId) ? classItemId : [classItemId])?.forEach(id => {
            this.classification.get(id)?.setSelected(true);
        });

        this.classification.setComponent(component);
    }

    unmount() {
        this.classification.clearType();
    }

    get asArray() {
        return this.classification.asArray;
    }
}

export const explosiveObjectClassificationVM = new ExplosiveObjectClassificationVM();
