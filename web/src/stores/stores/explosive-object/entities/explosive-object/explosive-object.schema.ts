import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IExplosiveObjectDTO, IExplosiveObjectDTOParams } from '~/api';

export interface IExplosiveObjectValue {
  id: string;
  type: string;
  name?: string;
  caliber?: number;
  createdAt: Dayjs,
  updatedAt: Dayjs,
}

export interface IExplosiveObjectValueParams {
  id: string;
  typeId: string;
  name?: string;
  caliber?: number;
  createdAt: Dayjs,
  updatedAt: Dayjs,
}
  
export const createExplosiveObjectDTO = (value: CreateValue<IExplosiveObjectValueParams>): CreateValue<IExplosiveObjectDTOParams>  => ({
	typeId: value.typeId,
	name: value?.name ?? null,
	caliber: value?.caliber ?? null,
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectValueParams, IExplosiveObjectDTOParams>(value  => ({
	typeId: value?.typeId ?? "",
	name: value?.name ?? null,
	caliber: value?.caliber ?? null,
}));

export const createExplosiveObject = (value: IExplosiveObjectDTO): IExplosiveObjectValue => ({
	id: value.id,
	type: value.typeId,
	name: value?.name ?? "",
	caliber: value?.caliber ?? undefined,
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});