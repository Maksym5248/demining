import { EQUIPMENT_TYPE } from 'shared-my/db';
import { type Dayjs } from 'dayjs';

import { type IEquipmentDTO } from '~/api';
import { dates, data } from '~/common';
import { type ICreateValue } from '~/common';

export interface IEquipmentValue {
    id: string;
    name: string;
    type: EQUIPMENT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createEquipmentDTO = (value: ICreateValue<IEquipmentValue>): ICreateValue<IEquipmentDTO> => ({
    name: value.name,
    type: value.type,
});

export const updateEquipmentDTO = data.createUpdateDTO<IEquipmentValue, IEquipmentDTO>((value) => ({
    name: value?.name ?? '',
    type: value.type ?? EQUIPMENT_TYPE.MINE_DETECTOR,
}));

export const createEquipment = (value: IEquipmentDTO): IEquipmentValue => ({
    id: value.id,
    name: value.name,
    type: value.type,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class EquipmentValue implements IEquipmentValue {
    id: string;
    name: string;
    type: EQUIPMENT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IEquipmentValue) {
        this.id = value.id;
        this.name = value.name;
        this.type = value.type;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
