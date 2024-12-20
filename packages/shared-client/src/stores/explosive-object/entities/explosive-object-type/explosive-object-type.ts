import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectTypeData } from './explosive-object-type.schema';

export interface IExplosiveObjectType {
    data: IExplosiveObjectTypeData;
    displayName: string;
    id: string;
    updateFields(data: Partial<IExplosiveObjectTypeData>): void;
}

export class ExplosiveObjectType implements IExplosiveObjectType {
    data: IExplosiveObjectTypeData;

    constructor(data: IExplosiveObjectTypeData) {
        this.data = data;
        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.fullName;
    }

    updateFields(data: Partial<IExplosiveObjectTypeData>) {
        Object.assign(this.data, data);
    }
}
