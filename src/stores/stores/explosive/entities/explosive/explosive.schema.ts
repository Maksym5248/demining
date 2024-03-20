import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IExplosiveDTO } from '~/api';
import { EXPLOSIVE_TYPE } from '~/constants/db/explosive-type';

export interface IExplosiveValue {
  id: string;
  type: EXPLOSIVE_TYPE;
  name: string;
  createdAt: Dayjs,
  updatedAt: Dayjs,
}
  
export const createExplosiveDTO = (value: CreateValue<IExplosiveValue>): CreateValue<IExplosiveDTO>  => ({
	type: value.type,
	name: value.name,
});

export const updateExplosiveDTO = data.createUpdateDTO<IExplosiveValue, IExplosiveDTO>(value  => ({
	type: value?.type ?? EXPLOSIVE_TYPE.EXPLOSIVE,
	name: value?.name ?? "",
}));

export const createExplosive = (value: IExplosiveDTO): IExplosiveValue => ({
	id: value.id,
	type: value.type,
	name: value?.name ?? "",
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
});
