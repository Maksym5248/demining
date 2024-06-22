import { makeAutoObservable } from 'mobx';

import { type IExplosiveAPI } from '~/api';
import { type IMessage } from '~/services';

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
export class ExplosiveAction implements IExplosiveAction {
    api: IApi;
    services: IServices;
    data: IExplosiveActionData;

    constructor(data: IExplosiveActionData, params: { api: IApi; services: IServices }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get explosive() {
        return new Explosive(this.data, this);
    }

    updateFields(data: Partial<IExplosiveActionData>) {
        Object.assign(this, data);
    }
}
