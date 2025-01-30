import { makeAutoObservable } from 'mobx';
import { type IMaterialNotDB, materialsData } from 'shared-my';

import { type IUpdateValue } from '~/common';

import { type IExplosiveObjectDetailsData } from './explosive-object-details.schema';

export interface IExplosiveObjectDetails {
    data: IExplosiveObjectDetailsData;
    material?: IMaterialNotDB;
    id: string;
    updateFields(data: IUpdateValue<IExplosiveObjectDetailsData>): void;
}

export class ExplosiveObjectDetails implements IExplosiveObjectDetails {
    data: IExplosiveObjectDetailsData;

    constructor(data: IExplosiveObjectDetailsData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get material() {
        return materialsData.find(el => el.id === this.data.material);
    }

    updateFields(data: IUpdateValue<IExplosiveObjectDetailsData>) {
        Object.assign(this.data, data);
    }
}
