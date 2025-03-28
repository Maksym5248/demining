import { makeAutoObservable } from 'mobx';
import { type IMaterialNotDB, materialsData } from 'shared-my';

import { type IUpdateValue } from '~/common';
import { type IDataModel } from '~/models';

import { type IExplosiveObjectDetailsData } from './explosive-object-details.schema';

export interface IExplosiveObjectDetails extends IDataModel<IExplosiveObjectDetailsData> {
    materials?: IMaterialNotDB[];
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

    get materials() {
        return materialsData.filter(el => this.data.material.includes(el.id));
    }

    updateFields(data: IUpdateValue<IExplosiveObjectDetailsData>) {
        Object.assign(this.data, data);
    }
}
