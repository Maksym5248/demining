import { makeAutoObservable } from 'mobx';

import { type IExplosiveAPI } from '~/api';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

import { type IExplosiveActionData } from './explosive-action.schema';
import { Explosive } from '../explosive';

export interface IExplosiveAction {
    data: IExplosiveActionData;
    explosive: Explosive;
    updateFields(data: Partial<IExplosiveActionData>): void;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}
interface IStores {
    viewer: IViewerStore;
}

export class ExplosiveAction implements IExplosiveAction {
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    data: IExplosiveActionData;

    constructor(data: IExplosiveActionData, params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    get explosive() {
        return new Explosive(this.data, this);
    }

    updateFields(data: Partial<IExplosiveActionData>) {
        Object.assign(this.data, data);
    }
}
