import { type Dayjs } from 'dayjs';

import { type IEquipmentDTO } from '~/api';
import { EQUIPMENT_TYPE } from '~/constants';
import { type CreateValue } from '@/shared-client';
import { dates, data } from '~/utils';

export interface IEquipmentValue {
    id: string;
    name: string;
    type: EQUIPMENT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createEquipmentDTO = (value: CreateValue<IEquipmentValue>): CreateValue<IEquipmentDTO> => ({
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
