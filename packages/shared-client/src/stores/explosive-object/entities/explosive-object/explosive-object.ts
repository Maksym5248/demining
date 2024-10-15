import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_STATUS, EXPLOSIVE_OBJECT_TYPE } from 'shared-my';

import { type IExplosiveObjectAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores/viewer';

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

interface IStores {
    viewer: IViewerStore;
}

interface IExplosiveObjectParams {
    collections: ICollections;
    api: IApi;
    services: IServices;
    stores: IStores;
}

export interface IExplosiveObject {
    id: string;
    data: IExplosiveObjectData;
    displayName: string;
    signName: string;
    update: RequestModel<[IUpdateValue<IExplosiveObjectData>]>;
    type?: IExplosiveObjectType;
    countries?: ICountry[];
    details?: IExplosiveObjectDetails;
    class?: IExplosiveObjectClass[];
    isConfirmed: boolean;
    isCurrentOrganization: boolean;
}

export class ExplosiveObject implements IExplosiveObject {
    api: IApi;
    services: IServices;
    collections: ICollections;
    stores: IStores;
    data: IExplosiveObjectData;

    constructor(data: IExplosiveObjectData, { collections, api, services, stores }: IExplosiveObjectParams) {
        this.data = data;

        this.collections = collections;
        this.api = api;
        this.services = services;
        this.stores = stores;

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
        if (
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.UAM ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MLRS ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MORTAL_MINES ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AMMO
        ) {
            return `${this?.data?.name}${this?.data?.name ? ' ' : ''}${this.type?.data.name}-${this.details?.data.caliber}мм`;
        }

        if (this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AVIATION_BOMBS) {
            return `${this?.data.name}-${this.details?.data.caliber}`;
        }

        return String(this.data.name);
    }

    get signName() {
        if (
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.UAM ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MLRS ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MORTAL_MINES ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AMMO
        ) {
            return `${this.type?.data.name}-${this.details?.data.caliber}мм`;
        }

        if (this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AVIATION_BOMBS) {
            return `${this?.data.name}-${this.details?.data.caliber}`;
        }

        if (EXPLOSIVE_OBJECT_TYPE.RG || EXPLOSIVE_OBJECT_TYPE.ENGINEERING) {
            return String(this.type?.data.name);
        }

        return String(this.data.name);
    }

    get isConfirmed() {
        return this.data.status === EXPLOSIVE_OBJECT_STATUS.CONFIRMED;
    }

    get isCurrentOrganization() {
        return this.data.organizationId === this.stores.viewer.user?.data.organization?.id;
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
