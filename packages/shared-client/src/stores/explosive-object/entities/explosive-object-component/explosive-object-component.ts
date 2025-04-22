import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IExplosiveObjectComponentData } from './explosive-object-component.schema';

export interface IExplosiveObjectComponent extends IDataModel<IExplosiveObjectComponentData> {
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectComponentData>): void;
}

export class ExplosiveObjectComponent implements IExplosiveObjectComponent {
    data: IExplosiveObjectComponentData;

    constructor(data: IExplosiveObjectComponentData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveObjectComponentData>) {
        Object.assign(this.data, data);
    }
}
