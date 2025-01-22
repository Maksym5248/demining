import { makeAutoObservable } from 'mobx';

import { type IExplosiveDeviceAPI } from '~/api';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

import { type IExplosiveDeviceActionData } from './explosive-device-action.schema';
import { ExplosiveDevice } from '../explosive-device';

export interface IExplosiveDeviceAction {
    data: IExplosiveDeviceActionData;
    explosive: ExplosiveDevice;
    updateFields(data: Partial<IExplosiveDeviceActionData>): void;
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

export class ExplosiveDeviceAction implements IExplosiveDeviceAction {
    api: IApi;
    services: IServices;
    data: IExplosiveDeviceActionData;
    getStores: () => IStores;
    constructor(data: IExplosiveDeviceActionData, params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;
        makeAutoObservable(this);
    }

    get explosive() {
        return new ExplosiveDevice(this.data, this);
    }

    updateFields(data: Partial<IExplosiveDeviceActionData>) {
        Object.assign(this.data, data);
    }
}
