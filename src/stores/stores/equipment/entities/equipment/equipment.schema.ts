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

export const updateEquipmentDTO = data.createUpdateDTO<IEquipmentValue, IEquipmentDTO>(createEquipmentDTO);

export const createEquipment = (value: IEquipmentDTO): IEquipmentValue => ({
  id: value.id,
  name: value.name,
  type: value.type,
  createdAt: dates.create(value.createdAt),
  updatedAt: dates.create(value.updatedAt),
});
