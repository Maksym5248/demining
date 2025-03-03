import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_STATUS, explosiveDeviceTypeData, type IExplosiveDeviceTypeNotDB } from 'shared-my';

import { type IExplosiveDeviceAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores/viewer';

import { type IExplosiveDeviceData, updateExplosiveDeviceDTO, createExplosiveDevice } from './explosive-device.schema';

export interface IExplosiveDevice {
    id: string;
    data: IExplosiveDeviceData;
    type?: IExplosiveDeviceTypeNotDB;
    imageUri?: string | null;
    displayName: string;
    isCurrentOrganization: boolean;
    isEditable: boolean;
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

interface IStores {
    viewer?: IViewerStore;
}

export class ExplosiveDevice implements IExplosiveDevice {
    api: IApi;
    services: IServices;
    getStores: () => IStores;
    data: IExplosiveDeviceData;
    constructor(data: IExplosiveDeviceData, params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get type() {
        return explosiveDeviceTypeData.find(item => item.id === this.data.type);
    }

    get isCurrentOrganization() {
        return this.data.organizationId === this.getStores()?.viewer?.user?.data.organization?.id;
    }

    get isConfirmed() {
        return this.data.status === EXPLOSIVE_OBJECT_STATUS.CONFIRMED;
    }

    get isPending() {
        return this.data.status === EXPLOSIVE_OBJECT_STATUS.PENDING;
    }

    get isEditable() {
        return !!this.getStores()?.viewer?.user?.isContentAdmin;
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
