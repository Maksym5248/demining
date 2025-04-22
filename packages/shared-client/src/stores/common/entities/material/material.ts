import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IMaterialData } from './material.schema';

export interface IMaterial extends IDataModel<IMaterialData> {
    displayName: string;
    updateFields(data: Partial<IMaterialData>): void;
}

export class Material implements IMaterial {
    data: IMaterialData;

    constructor(data: IMaterialData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IMaterialData>) {
        Object.assign(this.data, data);
    }
}
