import { type IExplosiveObjectActionSumValue } from './entities';

export class SumExplosiveObjectActions {
    total = 0;
    discovered = 0;
    transported = 0;
    destroyed = 0;

    set(value: IExplosiveObjectActionSumValue) {
        Object.assign(this, value);
    }
}
