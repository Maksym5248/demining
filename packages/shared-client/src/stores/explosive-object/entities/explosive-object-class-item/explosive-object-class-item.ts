import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassItemAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

import {
    createExplosiveObjectClassItem,
    updateExplosiveObjectClassItemDTO,
    type IExplosiveObjectClassItemData,
} from './explosive-object-class-item.schema';

export interface IExplosiveObjectClassItem extends IDataModel<IExplosiveObjectClassItemData> {
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectClassItemData>): void;
    update: RequestModel<[IUpdateValue<IExplosiveObjectClassItemData>]>;
    isEditable: boolean;
}

interface IApi {
    explosiveObjectClassItem: IExplosiveObjectClassItemAPI;
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

export class ExplosiveObjectClassItem implements IExplosiveObjectClassItem {
    data: IExplosiveObjectClassItemData;
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    constructor(data: IExplosiveObjectClassItemData, params: IExplosiveObjectClassParams) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.name;
    }

    updateFields(data: Partial<IExplosiveObjectClassItemData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectClassItemData>) => {
            const res = await this.api.explosiveObjectClassItem.update(
                this.data.id,
                updateExplosiveObjectClassItemDTO({ ...this.data, ...data }),
            );
            this.updateFields(createExplosiveObjectClassItem(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    get isEditable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.edit(this.data);
    }
}
