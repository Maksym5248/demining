import { message } from 'antd';

import { type IEquipmentAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';

import { type IEquipmentValue, updateEquipmentDTO, createEquipment, EquipmentValue } from './equipment.schema';

export interface IEquipment extends IEquipmentValue {
    updateFields: (data: Partial<IEquipmentValue>) => void;
    update: RequestModel<[IUpdateValue<IEquipmentValue>]>;
}

interface IApi {
    equipment: IEquipmentAPI;
}

interface IEquipmentParams {
    api: IApi;
}

export class Equipment extends EquipmentValue {
    api: IApi;

    constructor(value: IEquipmentValue, params: IEquipmentParams) {
        super(value);
        this.api = params.api;
    }

    updateFields(data: Partial<IEquipmentValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IEquipmentValue>) => {
            const res = await this.api.equipment.update(this.id, updateEquipmentDTO(data));
            this.updateFields(createEquipment(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
