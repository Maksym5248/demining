import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectGroupData } from './explosive-object-group.schema';

export interface IExplosiveObjectGroup {
    data: IExplosiveObjectGroupData;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectGroupData>): void;
}

export class ExplosiveObjectGroup implements IExplosiveObjectGroup {
    data: IExplosiveObjectGroupData;

    constructor(data: IExplosiveObjectGroupData) {
        this.data = data;
        makeAutoObservable(this);
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveObjectGroupData>) {
        Object.assign(this.data, data);
    }
}
