import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS } from 'shared-my';

import { type IExplosiveAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

import { type IExplosiveData, updateExplosiveDTO, createExplosive } from './explosive.schema';

export interface IExplosive extends IDataModel<IExplosiveData> {
    imageUri?: string | null;
    isCurrentOrganization: boolean;
    displayName: string;
    isEditable: boolean;
    update: RequestModel<[IUpdateValue<IExplosiveData>]>;
    isConfirmed: boolean;
    isPending: boolean;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}

interface IStores {
    viewer?: IViewerStore;
}

export class Explosive implements IExplosive {
    api: IApi;
    services: IServices;
    getStores: () => IStores;
    data: IExplosiveData;
    constructor(data: IExplosiveData, params: { api: IApi; services: IServices; getStores: () => IStores }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get imageUri() {
        return this.data.imageUri;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveData>) {
        Object.assign(this.data, data);
    }

    get isConfirmed() {
        return this.data.status === APPROVE_STATUS.CONFIRMED;
    }

    get isPending() {
        return this.data.status === APPROVE_STATUS.PENDING;
    }

    get isCurrentOrganization() {
        return this.data.organizationId === this.getStores()?.viewer?.user?.data.organization?.id;
    }

    get isEditable() {
        const { permissions } = this.getStores()?.viewer?.user ?? {};
        return !!permissions?.ammo?.edit(this.data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveData>) => {
            const res = await this.api.explosive.update(this.data.id, updateExplosiveDTO({ ...this.data, ...data }));

            this.updateFields(createExplosive(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
