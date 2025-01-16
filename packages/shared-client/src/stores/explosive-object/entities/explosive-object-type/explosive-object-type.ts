import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectTypeAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    createExplosiveObjectType,
    updateExplosiveObjectTypeDTO,
    type IExplosiveObjectTypeDataParams,
    type IExplosiveObjectTypeData,
} from './explosive-object-type.schema';

interface IApi {
    explosiveObjectType: IExplosiveObjectTypeAPI;
}

interface IServices {
    message: IMessage;
}

export interface IExplosiveObjectTypeParams {
    services: IServices;
    api: IApi;
}

export interface IExplosiveObjectType {
    data: IExplosiveObjectTypeData;
    displayName: string;
    id: string;
    updateFields(data: Partial<IExplosiveObjectTypeData>): void;
    update: RequestModel<[IUpdateValue<IExplosiveObjectTypeData>]>;
}

export class ExplosiveObjectType implements IExplosiveObjectType {
    data: IExplosiveObjectTypeData;
    api: IApi;
    services: IServices;

    constructor(data: IExplosiveObjectTypeData, params: IExplosiveObjectTypeParams) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.fullName;
    }

    updateFields(data: Partial<IExplosiveObjectTypeData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectTypeDataParams>) => {
            const res = await this.api.explosiveObjectType.update(this.data.id, updateExplosiveObjectTypeDTO(data));
            this.updateFields(createExplosiveObjectType(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
