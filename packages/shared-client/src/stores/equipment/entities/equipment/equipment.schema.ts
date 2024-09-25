import { type Dayjs } from 'dayjs';
import { EQUIPMENT_TYPE } from 'shared-my';

import { type IEquipmentDTO } from '~/api';
import { dates, data } from '~/common';
import { type ICreateValue } from '~/common';

export interface IEquipmentData {
    id: string;
    name: string;
    type: EQUIPMENT_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createEquipmentDTO = (value: ICreateValue<IEquipmentData>): ICreateValue<IEquipmentDTO> => ({
    name: value.name,
    type: value.type,
});

export const updateEquipmentDTO = data.createUpdateDTO<IEquipmentData, IEquipmentDTO>((value) => ({
    name: value?.name ?? '',
    type: value.type ?? EQUIPMENT_TYPE.MINE_DETECTOR,
}));

export const createEquipment = (value: IEquipmentDTO): IEquipmentData => ({
    id: value.id,
    name: value.name,
    type: value.type,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
