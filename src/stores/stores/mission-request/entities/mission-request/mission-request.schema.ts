import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import {IMissionRequestDB } from '~/db';

export interface IMissionRequestValue {
  id: string,
  signedAt: Dayjs,
  number: number,
  createdAt: Dayjs,
  updatedAt: Dayjs,
}
  
export const createMissionRequestDB = (value: Partial<IMissionRequestValue>): CreateValue<IMissionRequestDB>  => ({
  signedAt: dates.toDate(value.signedAt),
  number: value.number
});

export const updateMissionRequestDB = data.createUpdateDB<IMissionRequestValue, IMissionRequestDB>(createMissionRequestDB);

export const createMissionRequest = (value: IMissionRequestDB): IMissionRequestValue => ({
  id: value.id,
  signedAt: dates.create(value.signedAt),
  number: value.number,
  createdAt: dates.create(value.createdAt),
  updatedAt: dates.create(value.updatedAt),
});
