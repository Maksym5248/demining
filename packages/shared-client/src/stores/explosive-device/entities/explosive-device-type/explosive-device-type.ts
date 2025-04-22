import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IExplosiveDeviceTypeData } from './explosive-device-type.schema';

export interface IExplosiveDeviceType extends IDataModel<IExplosiveDeviceTypeData> {
    displayName: string;
    updateFields(data: Partial<IExplosiveDeviceTypeData>): void;
}

export class ExplosiveDeviceType implements IExplosiveDeviceType {
    data: IExplosiveDeviceTypeData;

    constructor(data: IExplosiveDeviceTypeData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveDeviceTypeData>) {
        Object.assign(this.data, data);
    }
}
