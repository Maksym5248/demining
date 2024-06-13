import { ExplosiveObjectTypeValue, type IExplosiveObjectTypeValue } from './explosive-object-type.schema';

export interface IExplosiveObjectType extends IExplosiveObjectTypeValue {
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectTypeValue>): void;
}

export class ExplosiveObjectType extends ExplosiveObjectTypeValue {
    constructor(value: IExplosiveObjectTypeValue) {
        super(value);
    }

    get displayName() {
        return `${this.name} (${this.fullName})`;
    }

    updateFields(data: Partial<IExplosiveObjectTypeValue>) {
        Object.assign(this, data);
    }
}
