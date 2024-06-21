import { type IExplosiveObjectAPI } from '~/api';
import { customMakeAutoObservable, type IUpdateValue } from '~/common';
import { type ICollectionModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IExplosiveObjectValueParams,
    ExplosiveObjectValue,
    updateExplosiveObjectDTO,
    createExplosiveObject,
    type IExplosiveObjectValue,
} from './explosive-object.schema';
import { type ExplosiveObjectType, type ExplosiveObjectTypeValue } from '../explosive-object-type';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface IExplosiveObjectParams {
    collections: {
        type: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;
    };
    api: IApi;
    services: IServices;
}

export interface IExplosiveObject extends IExplosiveObjectValue {
    type?: ExplosiveObjectType;
    displayName: string;
    fullDisplayName: string;
    update: RequestModel<[IUpdateValue<IExplosiveObjectValueParams>]>;
}

export class ExplosiveObject extends ExplosiveObjectValue implements IExplosiveObject {
    api: IApi;
    services: IServices;

    collections: {
        type: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;
    };

    constructor(data: IExplosiveObjectValueParams, { collections, api, services }: IExplosiveObjectParams) {
        super(data);
        this.collections = collections;
        this.api = api;
        this.services = services;

        customMakeAutoObservable(this);
    }

    updateFields(data: IUpdateValue<IExplosiveObjectValueParams>) {
        Object.assign(self, data);
    }

    get type() {
        return this.collections.type.get(this.typeId);
    }

    get displayName() {
        return `${self.name ?? ''}${self.name && this.caliber ? '  -  ' : ''}${this.caliber ? this.caliber : ''}`;
    }

    get fullDisplayName() {
        return `${this.type?.name}${this.displayName ? ' -  ' : ''}${this.displayName}`;
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectValueParams>) => {
            const res = await this.api.explosiveObject.update(this.id, updateExplosiveObjectDTO(data));

            this.updateFields(createExplosiveObject(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
