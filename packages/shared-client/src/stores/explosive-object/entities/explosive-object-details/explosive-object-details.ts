import { makeAutoObservable } from 'mobx';

import { type IUpdateValue } from '~/common';
import { type ICollectionModel, type IDataModel } from '~/models';
import { type IMaterial, type IMaterialData } from '~/stores/common';

import { type IExplosiveObjectDetailsData } from './explosive-object-details.schema';

export interface IExplosiveObjectDetails extends IDataModel<IExplosiveObjectDetailsData> {
    materials?: IMaterialData[];
    updateFields(data: IUpdateValue<IExplosiveObjectDetailsData>): void;
}

export interface ICollections {
    material: ICollectionModel<IMaterial, IMaterialData>;
}

export class ExplosiveObjectDetails implements IExplosiveObjectDetails {
    data: IExplosiveObjectDetailsData;
    collections: ICollections;

    constructor(data: IExplosiveObjectDetailsData, { collections }: { collections: ICollections }) {
        this.data = data;
        this.collections = collections;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get materials() {
        return this.data.material.map(material => this.collections.material.get(material)?.data) as IMaterialData[];
    }

    updateFields(data: Partial<IExplosiveObjectDetailsData>) {
        Object.assign(this.data, data);
    }
}
