import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IMissionRequestDTO } from '~/api';

export interface IMissionRequestValue {
  id: string,
  signedAt: Dayjs,
  number: number,
  createdAt: Dayjs,
  updatedAt: Dayjs,
}
  
export const createMissionRequestDTO = (value: CreateValue<IMissionRequestValue>): CreateValue<IMissionRequestDTO>  => ({
  signedAt: dates.toDate(value.signedAt),
  number: value.number
});

export const updateMissionRequestDTO = data.createUpdateDTO<IMissionRequestValue, IMissionRequestDTO>(createMissionRequestDTO);

export const createMissionRequest = (value: IMissionRequestDTO): IMissionRequestValue => ({
  id: value.id,
  signedAt: dates.create(value.signedAt),
  number: value.number,
  createdAt: dates.create(value.createdAt),
  updatedAt: dates.create(value.updatedAt),
});
