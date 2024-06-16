import { type UpdateValue } from '@/shared-client';
import { RequestModel } from '@/shared-client';
import { message } from 'antd';

import { Api } from '~/api';

import { type IEquipmentValue, updateEquipmentDTO, createEquipment, EquipmentValue } from './equipment.schema';

export interface IEquipment extends IEquipmentValue {
    updateFields: (data: Partial<IEquipmentValue>) => void;
    update: RequestModel<[UpdateValue<IEquipmentValue>]>;
}

export class Equipment extends EquipmentValue {
    constructor(value: IEquipmentValue) {
        super(value);
    }

    updateFields(data: Partial<IEquipmentValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: UpdateValue<IEquipmentValue>) => {
            const res = await Api.equipment.update(this.id, updateEquipmentDTO(data));
            this.updateFields(createEquipment(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
