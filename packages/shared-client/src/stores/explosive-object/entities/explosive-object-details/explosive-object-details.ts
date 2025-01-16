import { makeAutoObservable } from 'mobx';

import { type IUpdateValue } from '~/common';

import { type IExplosiveObjectDetailsData } from './explosive-object-details.schema';

export interface IExplosiveObjectDetails {
    data: IExplosiveObjectDetailsData;
    updateFields(data: IUpdateValue<IExplosiveObjectDetailsData>): void;
}

export class ExplosiveObjectDetails implements IExplosiveObjectDetails {
    data: IExplosiveObjectDetailsData;

    constructor(data: IExplosiveObjectDetailsData) {
        this.data = data;

        makeAutoObservable(this);
    }

    updateFields(data: IUpdateValue<IExplosiveObjectDetailsData>) {
        Object.assign(this.data, data);
    }
}
