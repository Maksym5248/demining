import { makeAutoObservable } from 'mobx';

import { type IEquipmentAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IEquipmentData, updateEquipmentDTO, createEquipment } from './equipment.schema';

export interface IEquipment {
    id: string;
    data: IEquipmentData;
    updateFields: (data: Partial<IEquipmentData>) => void;
    update: RequestModel<[IUpdateValue<IEquipmentData>]>;
}

interface IApi {
    equipment: IEquipmentAPI;
}

interface IServices {
    message: IMessage;
}

interface IEquipmentParams {
    api: IApi;
    services: IServices;
}

export class Equipment implements IEquipment {
    api: IApi;
    services: IServices;
    data: IEquipmentData;

    constructor(data: IEquipmentData, params: IEquipmentParams) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IEquipmentData>) {
        Object.assign(this.data, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IEquipmentData>) => {
            const res = await this.api.equipment.update(this.data.id, updateEquipmentDTO(data));
            this.updateFields(createEquipment(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
