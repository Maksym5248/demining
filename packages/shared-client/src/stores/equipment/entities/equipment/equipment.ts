import { type IEquipmentAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';

import { type IEquipmentValue, updateEquipmentDTO, createEquipment, EquipmentValue } from './equipment.schema';
import { IMessage } from '~/services';

export interface IEquipment extends IEquipmentValue {
    updateFields: (data: Partial<IEquipmentValue>) => void;
    update: RequestModel<[IUpdateValue<IEquipmentValue>]>;
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


export class Equipment extends EquipmentValue {
    api: IApi;
    services: IServices;
    
    constructor(value: IEquipmentValue, params: IEquipmentParams) {
        super(value);
        this.api = params.api;
        this.services = params.services;
    }

    updateFields(data: Partial<IEquipmentValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IEquipmentValue>) => {
            const res = await this.api.equipment.update(this.id, updateEquipmentDTO(data));
            this.updateFields(createEquipment(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
