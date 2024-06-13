import { ExplosiveActionValue, type IExplosiveActionValue } from './explosive-action.schema';
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
        return new ExplosiveActionValue(this);
    }

    get explosive() {
        return new Explosive(this);
    }

    updateFields(data: Partial<IExplosiveActionValue>) {
        Object.assign(this, data);
    }
}
