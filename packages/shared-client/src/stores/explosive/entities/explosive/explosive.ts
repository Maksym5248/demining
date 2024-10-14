import { makeAutoObservable } from 'mobx';

import { type IExplosiveAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

import { type IExplosiveData, updateExplosiveDTO, createExplosive } from './explosive.schema';

export interface IExplosive {
    id: string;
    data: IExplosiveData;
    update: RequestModel<[IUpdateValue<IExplosiveData>]>;
    isCurrentOrganization: boolean;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer: IViewerStore;
}

export class Explosive implements IExplosive {
    api: IApi;
    services: IServices;
    stores: IStores;
    data: IExplosiveData;
    constructor(data: IExplosiveData, params: { api: IApi; services: IServices; stores: IStores }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;
        this.stores = params.stores;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IExplosiveData>) {
        Object.assign(this.data, data);
    }

    get isCurrentOrganization() {
        return this.data.organizationId === this.stores.viewer.user?.data.organization?.id;
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
