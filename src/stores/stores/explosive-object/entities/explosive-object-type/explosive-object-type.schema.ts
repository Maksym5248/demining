import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IExplosiveObjectTypeDTO } from '~/api';

export interface IExplosiveObjectTypeValue {
  id: string;
  name: string;
  fullName: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}
  
export const createExplosiveObjectTypeDTO = (value: CreateValue<IExplosiveObjectTypeValue>): CreateValue<IExplosiveObjectTypeDTO>  => ({
  name: value.name,
  fullName: value.fullName
});

export const updateExplosiveObjectTypeDTO = data.createUpdateDTO<IExplosiveObjectTypeValue, IExplosiveObjectTypeDTO>(value => ({
  name: value?.name ?? "",
  fullName: value?.fullName ?? ""
}));

export const createExplosiveObjectType = (value: IExplosiveObjectTypeDTO): IExplosiveObjectTypeValue => ({
  id: value.id,
  name: value.name,
  fullName: value.fullName,
  createdAt: dates.create(value.createdAt),
  updatedAt: dates.create(value.updatedAt),
});
