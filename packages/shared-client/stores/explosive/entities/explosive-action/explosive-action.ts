import { type IExplosiveAPI } from '~/api';

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

export class ExplosiveAction extends ExplosiveActionValue {
    api: IApi;

    constructor(data: IExplosiveActionValue, params: { api: IApi }) {
        super(data);
        this.api = params.api;
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
