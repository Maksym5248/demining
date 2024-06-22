import { makeAutoObservable } from 'mobx';

import { type IExplosiveAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IExplosiveData, updateExplosiveDTO, createExplosive } from './explosive.schema';

export interface IExplosive {
    id: string;
    data: IExplosiveData;
    update: RequestModel<[IUpdateValue<IExplosiveData>]>;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}

export class Explosive implements IExplosive {
    api: IApi;
    services: IServices;
    data: IExplosiveData;
    constructor(data: IExplosiveData, params: { api: IApi; services: IServices }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IExplosiveData>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveData>) => {
            const res = await this.api.explosive.update(this.data.id, updateExplosiveDTO(data));

            this.updateFields(createExplosive(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
