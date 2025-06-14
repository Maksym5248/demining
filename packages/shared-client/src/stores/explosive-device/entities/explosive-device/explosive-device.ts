import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS } from 'shared-my';

import { type IExplosiveDeviceAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, type IDataModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores/viewer';

import { type IExplosiveDeviceData, updateExplosiveDeviceDTO, createExplosiveDevice } from './explosive-device.schema';
import { type IExplosiveDeviceType, type IExplosiveDeviceTypeData } from '../explosive-device-type';

export interface IExplosiveDevice extends IDataModel<IExplosiveDeviceData> {
    type?: IExplosiveDeviceTypeData;
    imageUri?: string | null;
    displayName: string;
    isCurrentOrganization: boolean;
    isEditable: boolean;
    isRemovable: boolean;
    isPending: boolean;
    isConfirmed: boolean;
    update: RequestModel<[IUpdateValue<IExplosiveDeviceData>]>;
}

interface IApi {
    explosiveDevice: IExplosiveDeviceAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    type: ICollectionModel<IExplosiveDeviceType, IExplosiveDeviceTypeData>;
}

interface IStores {
    viewer?: IViewerStore;
}

export class ExplosiveDevice implements IExplosiveDevice {
    api: IApi;
    services: IServices;
    getStores: () => IStores;
    data: IExplosiveDeviceData;
    collections: ICollections;

    constructor(
        data: IExplosiveDeviceData,
        params: { api: IApi; services: IServices; getStores: () => IStores; collections: ICollections },
    ) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;
        this.collections = params.collections;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get type() {
        return this.collections.type.get(this.data.type)?.data;
    }

    get isCurrentOrganization() {
        return this.data.organizationId === this.getStores()?.viewer?.user?.data.organization?.id;
    }

    get isConfirmed() {
        return this.data.status === APPROVE_STATUS.CONFIRMED;
    }

    get isPending() {
        return this.data.status === APPROVE_STATUS.PENDING;
    }

    get isEditable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.edit(this.data);
    }

    get isRemovable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.remove(this.data);
    }

    get displayName() {
        return this.data.name;
    }

    get imageUri() {
        return this.data.imageUri ?? null;
    }

    updateFields(data: Partial<IExplosiveDeviceData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveDeviceData>) => {
            const res = await this.api.explosiveDevice.update(this.data.id, updateExplosiveDeviceDTO(data));

            this.updateFields(createExplosiveDevice(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
