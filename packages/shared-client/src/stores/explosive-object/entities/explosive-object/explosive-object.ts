import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IExplosiveObjectDataParams,
    type IExplosiveObjectData,
    updateExplosiveObjectDTO,
    createExplosiveObject,
} from './explosive-object.schema';
import { type ICountryData, type ICountry } from '../country';
import { type IExplosiveObjectClass, type IExplosiveObjectClassData } from '../explosive-object-class';
import { type IExplosiveObjectClassItemData, type IExplosiveObjectClassItem } from '../explosive-object-class-item';
import { createExplosiveObjectDetails, type IExplosiveObjectDetails, type IExplosiveObjectDetailsData } from '../explosive-object-details';
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
    classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    country: ICollectionModel<ICountry, ICountryData>;
    details: ICollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>;
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
    type?: IExplosiveObjectType;
    countries?: ICountry[];
    details?: IExplosiveObjectDetails;
    class?: IExplosiveObjectClass[];
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

    updateFields(data: IUpdateValue<IExplosiveObjectDataParams>) {
        Object.assign(this.data, data);
    }

    get details() {
        return this.collections.details.get(this.data.detailsId);
    }

    get id() {
        return this.data.id;
    }

    get type() {
        return this.collections.type.get(this.data.typeId);
    }

    get displayName() {
        return `${this.data.name ?? ''}${this.data.name && this?.details?.data.caliber ? '  -  ' : ''}${this.details?.data.caliber ? `${this.details.data.caliber}мм` : ''}`;
    }

    get fullDisplayName() {
        return `${this.type?.data.name}${this.displayName ? ' -  ' : ''}${this.displayName}`;
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectDataParams>) => {
            const res = await this.api.explosiveObject.update(this.data.id, updateExplosiveObjectDTO(data));

            this.updateFields(createExplosiveObject(res));

            if (res.details) {
                const details = createExplosiveObjectDetails(res.id, res.details);
                this.collections.details.set(details.id, details);
            }
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
