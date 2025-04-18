import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

import { createExplosiveObjectClass, updateExplosiveObjectClassDTO, type IExplosiveObjectClassData } from './explosive-object-class.schema';

export interface IExplosiveObjectClass extends IDataModel<IExplosiveObjectClassData> {
    displayName: string;
    isEditable: boolean;
    update: RequestModel<[IUpdateValue<Omit<IExplosiveObjectClassData, 'typeId'>>]>;
}

interface IApi {
    explosiveObjectClass: IExplosiveObjectClassAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer?: IViewerStore;
}

interface IExplosiveObjectClassParams {
    services: IServices;
    api: IApi;
    getStores: () => IStores;
}

export class ExplosiveObjectClass implements IExplosiveObjectClass {
    data: IExplosiveObjectClassData;
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    constructor(data: IExplosiveObjectClassData, params: IExplosiveObjectClassParams) {
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

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

    get isEditable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.ammo?.edit(this.data);
    }
}
