import { CreateValue } from '~/types'
import { data } from '~/utils';
import { IExplosiveObjectHistoryDTO, IExplosiveObjectHistoryDTOParams } from '~/api';
import { EXPLOSIVE_OBJECT_CATEGORY } from '~/constants';

import { IExplosiveObjectValue, createExplosiveObject } from '../explosive-object';

export interface IExplosiveObjectHistoryValue extends IExplosiveObjectValue {
  explosiveObjectId: string;
  missionReportId: string;
  quantity: number;
  category: EXPLOSIVE_OBJECT_CATEGORY;
  isDiscovered: boolean;
  isTransported: boolean;
  isDestroyed: boolean;
}

export interface IExplosiveObjectHistoryValueParams {
  explosiveObjectId: string;
  missionReportId: string;
  quantity: number;
  category: EXPLOSIVE_OBJECT_CATEGORY;
  isDiscovered: boolean;
  isTransported: boolean;
  isDestroyed: boolean;
}

  
export const createExplosiveObjectHistoryDTO = (value: CreateValue<IExplosiveObjectHistoryValueParams>): CreateValue<IExplosiveObjectHistoryDTOParams>  => ({
	explosiveObjectId: value?.explosiveObjectId,
	missionReportId: value.missionReportId,
	quantity: value.quantity,
	category: value.category,
	isDiscovered: value.isDiscovered,
	isTransported: value.isTransported,
	isDestroyed: value.isDestroyed,
});

export const updateExplosiveObjectHistoryDTO = data.createUpdateDTO<IExplosiveObjectHistoryValueParams, IExplosiveObjectHistoryDTOParams>(value => ({
	explosiveObjectId: value?.explosiveObjectId ?? "",
	missionReportId: value.missionReportId ?? "",
	quantity: value?.quantity ?? 0,
	category: value?.category ?? EXPLOSIVE_OBJECT_CATEGORY.I,
	isDiscovered: value?.isDiscovered ?? false,
	isTransported: value?.isTransported ?? false,
	isDestroyed: value?.isDestroyed ?? false,
}));

export const createExplosiveObjectHistory = (value: IExplosiveObjectHistoryDTO): IExplosiveObjectHistoryValue => ({
	...createExplosiveObject(value),
	explosiveObjectId: value.explosiveObjectId,
	missionReportId: value.missionReportId,
	quantity: value.quantity,
	category: value.category,
	isDiscovered: value.isDiscovered,
	isTransported: value.isTransported,
	isDestroyed: value.isDestroyed,
});
