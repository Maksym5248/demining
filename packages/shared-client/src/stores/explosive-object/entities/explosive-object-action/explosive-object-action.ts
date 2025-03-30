import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectAPI } from '~/api';
import { type IDataModel, type ICollectionModel } from '~/models';
import { type IMessage } from '~/services';
import { type ICountry, type ICountryData, type IViewerStore } from '~/stores';

import { type IExplosiveObjectActionData } from './explosive-object-action.schema';
import {
    ExplosiveObject,
    type IExplosiveObjectType,
    type IExplosiveObjectTypeData,
    type IExplosiveObject,
    type IExplosiveObjectClass,
    type IExplosiveObjectClassData,
    type IExplosiveObjectClassItem,
    type IExplosiveObjectClassItemData,
    type IExplosiveObjectDetails,
    type IExplosiveObjectDetailsData,
} from '..';
import { type IClassifications } from '../../classifications';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    type: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    class: ICollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    country: ICollectionModel<ICountry, ICountryData>;
    details: ICollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>;
}

interface IStores {
    viewer?: IViewerStore;
}

interface IExplosiveObjectActionParams {
    collections: ICollections;
    api: IApi;
    services: IServices;
    getStores: () => IStores;
    classifications: IClassifications;
}

export interface IExplosiveObjectAction extends IDataModel<IExplosiveObjectActionData> {
    type?: IExplosiveObjectType;
    explosiveObject: IExplosiveObject;
    updateFields(data: Partial<IExplosiveObjectActionData>): void;
}

export class ExplosiveObjectAction implements IExplosiveObjectAction {
    api: IApi;
    collections: ICollections;
    services: IServices;
    getStores: () => IStores;
    data: IExplosiveObjectActionData;
    classifications: IClassifications;

    constructor(
        value: IExplosiveObjectActionData,
        { collections, api, services, getStores, classifications }: IExplosiveObjectActionParams,
    ) {
        this.data = value;
        this.collections = collections;
        this.api = api;
        this.services = services;
        this.getStores = getStores;
        this.classifications = classifications;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get type() {
        return this.collections.type.get(this.data.typeId);
    }

    get explosiveObject() {
        return new ExplosiveObject(this.data, this);
    }

    updateFields(data: Partial<IExplosiveObjectActionData>) {
        Object.assign(this.data, data);
    }
}
