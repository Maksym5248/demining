import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IExplosiveObjectDataParams,
    updateExplosiveObjectDTO,
    createExplosiveObject,
    type IExplosiveObjectData,
} from './explosive-object.schema';
import { type IExplosiveObjectType, type ExplosiveObjectType, type IExplosiveObjectTypeData } from '../explosive-object-type';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    type: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
}

interface IExplosiveObjectParams {
    collections: ICollections;
    api: IApi;
    services: IServices;
}

export interface IExplosiveObject {
    id: string;
    data: IExplosiveObjectData;
    type?: ExplosiveObjectType;
    displayName: string;
    fullDisplayName: string;
    update: RequestModel<[IUpdateValue<IExplosiveObjectData>]>;
}

export class ExplosiveObject implements IExplosiveObject {
    api: IApi;
    services: IServices;
    collections: ICollections;
    data: IExplosiveObjectData;

    constructor(data: IExplosiveObjectData, { collections, api, services }: IExplosiveObjectParams) {
        this.data = data;
        this.collections = collections;
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: IUpdateValue<IExplosiveObjectDataParams>) {
        Object.assign(this.data, data);
    }

    get type() {
        return this.collections.type.get(this.data.typeId);
    }

    get displayName() {
        return `${this.data.name ?? ''}${this.data.name && this.data.caliber ? '  -  ' : ''}${this.data.caliber ? this.data.caliber : ''}`;
    }

    get fullDisplayName() {
        return `${this.type?.data.name}${this.displayName ? ' -  ' : ''}${this.displayName}`;
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectDataParams>) => {
            const res = await this.api.explosiveObject.update(this.data.id, updateExplosiveObjectDTO(data));

            this.updateFields(createExplosiveObject(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
