import { makeAutoObservable } from 'mobx';

import { type IExplosiveObjectTypeAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type IViewerStore } from '~/stores';

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

interface IStores {
    viewer?: IViewerStore;
}

export interface IExplosiveObjectTypeParams {
    services: IServices;
    api: IApi;
    getStores: () => IStores;
}

export interface IExplosiveObjectType extends IDataModel<IExplosiveObjectTypeData> {
    displayName: string;
    updateFields(data: Partial<IExplosiveObjectTypeData>): void;
    update: RequestModel<[IUpdateValue<IExplosiveObjectTypeData>]>;
    isEditable: boolean;
    isRemovable: boolean;
}

export class ExplosiveObjectType implements IExplosiveObjectType {
    data: IExplosiveObjectTypeData;
    api: IApi;
    services: IServices;
    getStores: () => IStores;

    constructor(data: IExplosiveObjectTypeData, params: IExplosiveObjectTypeParams) {
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

    get isEditable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.editManagement(this.data);
    }

    get isRemovable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.removeManagement(this.data);
    }
}
