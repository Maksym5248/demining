import { type Dayjs } from 'dayjs';
import { MISSION_REQUEST_TYPE } from 'shared-my/db';

import { type IMissionRequestDTO, type IMissionRequestSumDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IMissionRequestData {
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

export const createMissionRequestDTO = (value: ICreateValue<IMissionRequestData>): ICreateValue<IMissionRequestDTO> => ({
    signedAt: dates.toDateServer(value.signedAt),
    number: value.number,
    type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
});

export const updateMissionRequestDTO = data.createUpdateDTO<IMissionRequestData, IMissionRequestDTO>((value) => ({
    signedAt: dates.toDateServer(value?.signedAt ?? new Date()),
    number: String(value?.number) ?? '',
    type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
}));

export const createMissionRequest = (value: IMissionRequestDTO): IMissionRequestData => ({
    id: value.id,
    signedAt: dates.fromServerDate(value.signedAt),
    number: String(value?.number) ?? '',
    type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createMissionRequestSum = (value: IMissionRequestSumDTO): IMissionRequestSumValue => ({
    total: value.total,
});
