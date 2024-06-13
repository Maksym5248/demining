import { toJS } from 'mobx';

import { ICollectionModel } from '~/utils/models';

import { ExplosiveObjectActionValue, IExplosiveObjectActionValue } from './explosive-object-action.schema';
import { ExplosiveObject, IExplosiveObject } from '..';
import { ExplosiveObjectType, ExplosiveObjectTypeValue, IExplosiveObjectType } from '../explosive-object-type';

interface IExplosiveObjectActionParams {
    collections: {
        type: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;
    };
}

export interface IExplosiveObjectAction extends IExplosiveObjectActionValue {
    type?: IExplosiveObjectType;
    value: IExplosiveObjectActionValue;
    explosiveObject: IExplosiveObject;
    updateFields(data: Partial<IExplosiveObjectActionValue>): void;
}

export class ExplosiveObjectAction extends ExplosiveObjectActionValue implements IExplosiveObjectAction {
    collectionType: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;

    constructor(value: IExplosiveObjectActionValue, { collections }: IExplosiveObjectActionParams) {
        super(value);
        this.collectionType = collections.type;
    }

    get value() {
        const { type, ...value } = toJS(this);
        return value;
    }

    get type() {
        return this.collectionType.get(this.typeId);
    }

    get explosiveObject() {
        return new ExplosiveObject(this, { collections: { type: this.collectionType } });
    }

    updateFields(data: Partial<IExplosiveObjectActionValue>) {
        Object.assign(self, data);
    }
}
