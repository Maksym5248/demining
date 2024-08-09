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
import { ExplosiveObjectDetails, type IExplosiveObjectDetails, type IExplosiveObjectDetailsData } from '../explosive-object-details';
import { type IExplosiveObjectGroupData, type IExplosiveObjectGroup } from '../explosive-object-group';
import { type IExplosiveObjectType, type IExplosiveObjectTypeData } from '../explosive-object-type';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    group: ICollectionModel<IExplosiveObjectGroup, IExplosiveObjectGroupData>;
    type: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    class: ICollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    country: ICollectionModel<ICountry, ICountryData>;
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
    countries?: ICountry[];
    details: IExplosiveObjectDetails | null;
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

    setDetails(data: IExplosiveObjectDetailsData) {
        this.details = new ExplosiveObjectDetails(data);
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
