import { makeAutoObservable } from 'mobx';

import { type IExplosiveDeviceAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores/viewer';

import { type IExplosiveDeviceData, updateExplosiveDeviceDTO, createExplosiveDevice } from './explosive-device.schema';

export interface IExplosiveDevice {
    id: string;
    data: IExplosiveDeviceData;
    imageUri?: string | null;
    displayName: string;
    isCurrentOrganization: boolean;
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

    get isCurrentOrganization() {
        return this.data.organizationId === this.getStores()?.viewer?.user?.data.organization?.id;
    }

    get displayName() {
        return this.data.name;
    }

    get imageUri() {
        return null;
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
