import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { createExplosiveObjectClass, updateExplosiveObjectClassDTO, type IExplosiveObjectClassData } from './explosive-object-class.schema';

export interface IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    id: string;
    displayName: string;
    update: RequestModel<[IUpdateValue<Omit<IExplosiveObjectClassData, 'typeId'>>]>;
}

interface IApi {
    explosiveObjectClass: IExplosiveObjectClassAPI;
}

interface IServices {
    message: IMessage;
}

interface IExplosiveObjectClassParams {
    services: IServices;
    api: IApi;
}

export class ExplosiveObjectClass implements IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    api: IApi;
    services: IServices;

    constructor(data: IExplosiveObjectClassData, params: IExplosiveObjectClassParams) {
        this.api = params.api;
        this.services = params.services;

        this.data = data;
        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveObjectClassData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectClassData>) => {
            const res = await this.api.explosiveObjectClass.update(this.data.id, updateExplosiveObjectClassDTO(data));
            this.updateFields(createExplosiveObjectClass(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
