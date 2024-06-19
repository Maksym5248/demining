import { MISSION_REQUEST_TYPE } from '@/shared/db';
import { type Dayjs } from 'dayjs';

import { type IMissionRequestDTO, type IMissionRequestSumDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

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

export const createMissionRequestDTO = (value: ICreateValue<IMissionRequestValue>): ICreateValue<IMissionRequestDTO> => ({
    signedAt: dates.toDateServer(value.signedAt),
    number: value.number,
    type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
});

export const updateMissionRequestDTO = data.createUpdateDTO<IMissionRequestValue, IMissionRequestDTO>((value) => ({
    signedAt: dates.toDateServer(value?.signedAt ?? new Date()),
    number: String(value?.number) ?? '',
    type: value.type ?? MISSION_REQUEST_TYPE.APPLICATION,
}));

export const createMissionRequest = (value: IMissionRequestDTO): IMissionRequestValue => ({
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

export class MissionRequestValue implements IMissionRequestValue {
    id: string;
    signedAt: Dayjs;
    number: string;
    type: MISSION_REQUEST_TYPE;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IMissionRequestValue) {
        this.id = value.id;
        this.signedAt = value.signedAt;
        this.number = value.number;
        this.type = value.type;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
