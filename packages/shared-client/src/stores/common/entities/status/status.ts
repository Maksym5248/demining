import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IStatusData } from './status.schema';

export interface IStatus extends IDataModel<IStatusData> {
    displayName: string;
    updateFields(data: Partial<IStatusData>): void;
}

export class Status implements IStatus {
    data: IStatusData;

    constructor(data: IStatusData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IStatusData>) {
        Object.assign(this.data, data);
    }
}
