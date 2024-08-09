import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassItemData } from './explosive-object-class-item.schema';

export interface IExplosiveObjectClassItem {
    data: IExplosiveObjectClassItemData;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectClassItemData>): void;
}

export class ExplosiveObjectClassItem implements IExplosiveObjectClassItem {
    data: IExplosiveObjectClassItemData;

    constructor(data: IExplosiveObjectClassItemData) {
        this.data = data;
        makeAutoObservable(this);
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveObjectClassItemData>) {
        Object.assign(this.data, data);
    }
}
