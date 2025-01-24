import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectAPI } from '~/api';
import { type ICollectionModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

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
    type ICountry,
    type ICountryData,
    type IExplosiveObjectDetails,
    type IExplosiveObjectDetailsData,
} from '..';

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
}

export interface IExplosiveObjectAction {
    data: IExplosiveObjectActionData;
    id: string;
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

    constructor(value: IExplosiveObjectActionData, { collections, api, services, getStores }: IExplosiveObjectActionParams) {
        this.data = value;
        this.collections = collections;
        this.api = api;
        this.services = services;
        this.getStores = getStores;

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
