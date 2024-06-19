import { type IExplosiveObjectAPI } from '~/api';
import { type ICollectionModel } from '~/models';

import { ExplosiveObjectActionValue, type IExplosiveObjectActionValue } from './explosive-object-action.schema';
import { ExplosiveObject, type IExplosiveObject } from '..';
import { type ExplosiveObjectType, type ExplosiveObjectTypeValue, type IExplosiveObjectType } from '../explosive-object-type';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IExplosiveObjectActionParams {
    collections: {
        type: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;
    };
    api: IApi;
}

export interface IExplosiveObjectAction extends IExplosiveObjectActionValue {
    type?: IExplosiveObjectType;
    value: IExplosiveObjectActionValue;
    explosiveObject: IExplosiveObject;
    updateFields(data: Partial<IExplosiveObjectActionValue>): void;
}

export class ExplosiveObjectAction extends ExplosiveObjectActionValue implements IExplosiveObjectAction {
    api: IApi;
    collections: {
        type: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;
    };

    constructor(value: IExplosiveObjectActionValue, { collections, api }: IExplosiveObjectActionParams) {
        super(value);
        this.collections = collections;
        this.api = api;
    }

    get value() {
        return new ExplosiveObjectActionValue(this);
    }

    get type() {
        return this.collections.type.get(this.typeId);
    }

    get explosiveObject() {
        return new ExplosiveObject(this, this);
    }

    updateFields(data: Partial<IExplosiveObjectActionValue>) {
        Object.assign(self, data);
    }
}
