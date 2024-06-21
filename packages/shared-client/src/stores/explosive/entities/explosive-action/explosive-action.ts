import { type IExplosiveAPI } from '~/api';
import { customMakeAutoObservable } from '~/common';
import { type IMessage } from '~/services';

import { ExplosiveActionValue, type IExplosiveActionValue } from './explosive-action.schema';
import { Explosive } from '../explosive';

export interface IExplosiveAction extends IExplosiveActionValue {
    explosive: Explosive;
    value: IExplosiveActionValue;
    updateFields(data: Partial<IExplosiveActionValue>): void;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}
export class ExplosiveAction extends ExplosiveActionValue {
    api: IApi;
    services: IServices;

    constructor(data: IExplosiveActionValue, params: { api: IApi; services: IServices }) {
        super(data);
        this.api = params.api;
        this.services = params.services;

        customMakeAutoObservable(this);
    }

    get value() {
        return new ExplosiveActionValue(this);
    }

    get explosive() {
        return new Explosive(this, this);
    }

    updateFields(data: Partial<IExplosiveActionValue>) {
        Object.assign(this, data);
    }
}
