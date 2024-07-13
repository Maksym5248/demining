import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectAPI } from '~/api';
import { type ICollectionModel } from '~/models';
import { type IMessage } from '~/services';

import { type IExplosiveObjectActionData } from './explosive-object-action.schema';
import { ExplosiveObject, type IExplosiveObject } from '..';
import { type IExplosiveObjectTypeData, type IExplosiveObjectType } from '../explosive-object-type';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    type: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
}
interface IExplosiveObjectActionParams {
    collections: ICollections;
    api: IApi;
    services: IServices;
}

export interface IExplosiveObjectAction {
    data: IExplosiveObjectActionData;
    types: IExplosiveObjectType[];
    explosiveObject: IExplosiveObject;
    updateFields(data: Partial<IExplosiveObjectActionData>): void;
}

export class ExplosiveObjectAction implements IExplosiveObjectAction {
    api: IApi;
    collections: ICollections;
    services: IServices;
    data: IExplosiveObjectActionData;

    constructor(value: IExplosiveObjectActionData, { collections, api, services }: IExplosiveObjectActionParams) {
        this.data = value;
        this.collections = collections;
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get types() {
        return this.data.typeIds.map((id) => this.collections.type.get(id)) as IExplosiveObjectType[];
    }

    get explosiveObject() {
        return new ExplosiveObject(this.data, this);
    }

    updateFields(data: Partial<IExplosiveObjectActionData>) {
        Object.assign(this.data, data);
    }
}
