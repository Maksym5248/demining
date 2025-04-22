import { makeAutoObservable } from 'mobx';

import { type IExplosiveDeviceAPI } from '~/api';
import { type ICollectionModel, type IDataModel } from '~/models';
import { type IMessage } from '~/services';
import { type IExplosiveDeviceType, type IExplosiveDeviceTypeData, type IViewerStore } from '~/stores';

import { type IExplosiveDeviceActionData } from './explosive-device-action.schema';
import { ExplosiveDevice } from '../explosive-device';

export interface IExplosiveDeviceAction extends IDataModel<IExplosiveDeviceActionData> {
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

interface ICollections {
    type: ICollectionModel<IExplosiveDeviceType, IExplosiveDeviceTypeData>;
}

export class ExplosiveDeviceAction implements IExplosiveDeviceAction {
    api: IApi;
    services: IServices;
    data: IExplosiveDeviceActionData;
    getStores: () => IStores;
    collections: ICollections;

    constructor(
        data: IExplosiveDeviceActionData,
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

    get explosive() {
        return new ExplosiveDevice(this.data, this);
    }

    updateFields(data: Partial<IExplosiveDeviceActionData>) {
        Object.assign(this.data, data);
    }
}
