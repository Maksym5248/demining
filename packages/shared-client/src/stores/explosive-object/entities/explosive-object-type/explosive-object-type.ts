import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectTypeData } from './explosive-object-type.schema';

export interface IExplosiveObjectType {
    data: IExplosiveObjectTypeData;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectTypeData>): void;
}

export class ExplosiveObjectType implements IExplosiveObjectType {
    data: IExplosiveObjectTypeData;

    constructor(data: IExplosiveObjectTypeData) {
        this.data = data;
        makeAutoObservable(this);
    }

    get displayName() {
        return this.data.fullName;
    }

    updateFields(data: Partial<IExplosiveObjectTypeData>) {
        Object.assign(this.data, data);
    }
}
