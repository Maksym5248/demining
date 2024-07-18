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
    type IExplosiveObjectDetails,
} from './explosive-object.schema';
import { type IExplosiveObjectClass, type IExplosiveObjectClassData } from '../explosive-object-class';
import { type IExplosiveObjectClassItem } from '../explosive-object-class-item';
import { ExplosiveObjectDetails, type IExplosiveObjectDetailsData } from '../explosive-object-details';
import { type IExplosiveObjectType, type IExplosiveObjectTypeData } from '../explosive-object-type';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    type: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    class: ICollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItem>;
    country: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
}

interface IExplosiveObjectParams {
    collections: ICollections;
    api: IApi;
    services: IServices;
}

export interface IExplosiveObject {
    id: string;
    data: IExplosiveObjectData;
    displayName: string;
    fullDisplayName: string;
    update: RequestModel<[IUpdateValue<IExplosiveObjectData>]>;
    setDetails(details: IExplosiveObjectDetailsData | IExplosiveObjectDetailsData): void;
    type?: IExplosiveObjectType;
    details: IExplosiveObjectDetailsData | null;
}

export class ExplosiveObject implements IExplosiveObject {
    api: IApi;
    services: IServices;
    collections: ICollections;
    data: IExplosiveObjectData;

    details: IExplosiveObjectDetails | null = null;

    constructor(data: IExplosiveObjectData, { collections, api, services }: IExplosiveObjectParams) {
        this.data = data;

        this.collections = collections;
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    setDetails(details: IExplosiveObjectDetailsData) {
        this.details = new ExplosiveObjectDetails(details);
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
        return this.data.name ?? '';
    }

    get fullDisplayName() {
        return this.data.name ?? '';
    }

    // get displayName() {
    //     return `${this.data.name ?? ''}${this.data.name && this.data?.details?.caliber ? '  -  ' : ''}${this.data.details > caliber ? this.data.caliber : ''}`;
    // }

    // get fullDisplayName() {
    //     return `${this.type?.data.name}${this.displayName ? ' -  ' : ''}${this.displayName}`;
    // }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectDataParams>) => {
            const res = await this.api.explosiveObject.update(this.data.id, updateExplosiveObjectDTO(data));

            this.updateFields(createExplosiveObject(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
