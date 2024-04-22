import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates, data } from '~/utils';
import { IMissionRequestDTO, IMissionRequestSumDTO } from '~/api';
import { MISSION_REQUEST_TYPE } from '~/constants';

export interface IMissionRequestValue {
  id: string;
  signedAt: Dayjs;
  number: string;
  type: MISSION_REQUEST_TYPE;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface IMissionRequestSumValue {
	total: number;
}
  
export const createMissionRequestDTO = (value: CreateValue<IMissionRequestValue>): CreateValue<IMissionRequestDTO>  => ({
	signedAt: dates.toDateServer(value.signedAt),
	number: value.number,
	type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
});

export const updateMissionRequestDTO = data.createUpdateDTO<IMissionRequestValue, IMissionRequestDTO>(value => ({
	signedAt: dates.toDateServer(value?.signedAt ?? new Date()),
	number: String(value?.number) ?? "",
	type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
}));

export const createMissionRequest = (value: IMissionRequestDTO): IMissionRequestValue => ({
	id: value.id,
	signedAt: dates.fromServerDate(value.signedAt),
	number: String(value?.number) ?? "",
	type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createMissionRequestSum = (value: IMissionRequestSumDTO): IMissionRequestSumValue => ({
	total: value.total,
});