import { toJS } from 'mobx';

import { ExplosiveActionValue, IExplosiveActionValue } from './explosive-action.schema';
import { Explosive } from '../explosive';

export interface IExplosiveAction extends IExplosiveActionValue {
    explosive: Explosive;
    value: IExplosiveActionValue;
    updateFields(data: Partial<IExplosiveActionValue>): void;
}

export class ExplosiveAction extends ExplosiveActionValue {
    constructor(data: IExplosiveActionValue) {
        super(data);
    }

    get value() {
        const { update, ...value } = toJS(this);
        return value;
    }

    get explosive() {
        return new Explosive(this);
    }

    updateFields(data: Partial<IExplosiveActionValue>) {
        Object.assign(this, data);
    }
}
