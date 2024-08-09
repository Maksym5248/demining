import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassData } from './explosive-object-class.schema';

export interface IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectClassData>): void;
}

export class ExplosiveObjectClass implements IExplosiveObjectClass {
    data: IExplosiveObjectClassData;

    constructor(data: IExplosiveObjectClassData) {
        this.data = data;
        makeAutoObservable(this);
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveObjectClassData>) {
        Object.assign(this.data, data);
    }
}
