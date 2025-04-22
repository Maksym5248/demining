import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IMissionRequestTypeData } from './mission-request-type.schema';

export interface IMissionRequestType extends IDataModel<IMissionRequestTypeData> {
    displayName: string;
    updateFields(data: Partial<IMissionRequestTypeData>): void;
}

export class MissionRequestType implements IMissionRequestType {
    data: IMissionRequestTypeData;

    constructor(data: IMissionRequestTypeData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IMissionRequestTypeData>) {
        Object.assign(this.data, data);
    }
}
