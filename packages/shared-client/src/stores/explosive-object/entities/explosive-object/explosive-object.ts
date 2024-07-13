import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_GROUP } from 'shared-my/db';

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
import { Ammo, type IAmmoData } from '../ammo';
import { type IExplosiveObjectType, type IExplosiveObjectTypeData } from '../explosive-object-type';
import { Fuse, type IFuseData } from '../fuse';

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
    data: Omit<IExplosiveObjectData, 'details'>;
    types: IExplosiveObjectType[];
    displayName: string;
    fullDisplayName: string;
    update: RequestModel<[IUpdateValue<IExplosiveObjectData>]>;
    setDetails(details: IFuseData | IAmmoData): void;
}

export class ExplosiveObject implements IExplosiveObject {
    api: IApi;
    services: IServices;
    collections: ICollections;
    data: Omit<IExplosiveObjectData, 'details'>;

    details: Fuse | Ammo | null = null;

    constructor(data: IExplosiveObjectData, { collections, api, services }: IExplosiveObjectParams) {
        this.data = data;

        this.collections = collections;
        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    setDetails(details: IFuseData | IAmmoData) {
        if (details && this.data.group === EXPLOSIVE_OBJECT_GROUP.FUSE) {
            this.details = new Fuse(details as unknown as IFuseData);
        }

        if (details && this.data.group === EXPLOSIVE_OBJECT_GROUP.AMMO) {
            this.details = new Ammo(details as unknown as IAmmoData);
        }
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: IUpdateValue<IExplosiveObjectDataParams>) {
        Object.assign(this.data, data);
    }

    get types() {
        return this.data.typeIds.map((id) => this.collections.type.get(id)) as IExplosiveObjectType[];
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
