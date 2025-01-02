import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectClassItemAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    createExplosiveObjectClassItem,
    updateExplosiveObjectClassItemDTO,
    type IExplosiveObjectClassItemData,
} from './explosive-object-class-item.schema';

export interface IExplosiveObjectClassItem {
    data: IExplosiveObjectClassItemData;
    id: string;
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectClassItemData>): void;
    update: RequestModel<[IUpdateValue<IExplosiveObjectClassItemData>]>;
}

interface IApi {
    explosiveObjectClassItem: IExplosiveObjectClassItemAPI;
}

interface IServices {
    message: IMessage;
}

interface IExplosiveObjectClassParams {
    services: IServices;
    api: IApi;
}

export class ExplosiveObjectClassItem implements IExplosiveObjectClassItem {
    data: IExplosiveObjectClassItemData;
    api: IApi;
    services: IServices;

    constructor(data: IExplosiveObjectClassItemData, params: IExplosiveObjectClassParams) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

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
            const res = await this.api.explosiveObjectClassItem.update(this.data.id, updateExplosiveObjectClassItemDTO(data));
            this.updateFields(createExplosiveObjectClassItem(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
