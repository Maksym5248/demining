import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { EQUIPMENT_TYPE } from '~/constants'
import { dates, data } from '~/utils';
import { IEquipmentDTO } from '~/api';

export interface IEquipmentValue {
  id: string;
  name: string;
  type: EQUIPMENT_TYPE;
  createdAt: Dayjs,
  updatedAt: Dayjs,
}
  
export const createEquipmentDTO = (value: CreateValue<IEquipmentValue>): CreateValue<IEquipmentDTO>  => ({
	name: value.name,
	type: value.type
});

export const updateEquipmentDTO = data.createUpdateDTO<IEquipmentValue, IEquipmentDTO>(value => ({
	name: value?.name ?? "",
	type: value.type ?? EQUIPMENT_TYPE.MINE_DETECTOR
}));

export const createEquipment = (value: IEquipmentDTO): IEquipmentValue => ({
	id: value.id,
	name: value.name,
	type: value.type,
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});
