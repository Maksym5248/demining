import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IExplosiveObjectHistoryDTO, IExplosiveObjectHistoryDTOParams } from '~/api';
import { EXPLOSIVE_OBJECT_CATEGORY } from '~/constants';

import { IExplosiveObjectValue, createExplosiveObjectDTO, createExplosiveObject, IExplosiveObjectValueParams } from '../explosive-object';

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
  explosiveObjectId: value.explosiveObjectId,
  missionReportId: value.missionReportId,
  quantity: value.quantity,
  category: value.category,
  isDiscovered: value.isDiscovered,
  isTransported: value.isTransported,
  isDestroyed: value.isDestroyed,
});

export const updateExplosiveObjectHistoryDTO = data.createUpdateDTO<IExplosiveObjectHistoryValue, IExplosiveObjectHistoryDTOParams>(createExplosiveObjectHistoryDTO);

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
