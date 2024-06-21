import { type IExplosiveAPI } from '~/api';

import { ExplosiveActionValue, type IExplosiveActionValue } from './explosive-action.schema';
import { Explosive } from '../explosive';
import { IMessage } from '~/services';

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

    constructor(data: IExplosiveActionValue, params: { api: IApi, services: IServices }) {
        super(data);
        this.api = params.api;
        this.services = params.services;
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
