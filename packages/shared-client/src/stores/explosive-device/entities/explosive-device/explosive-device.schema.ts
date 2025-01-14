import { type Dayjs } from 'dayjs';
import { EXPLOSIVE_DEVICE_TYPE } from 'shared-my';

import { type IExplosiveDeviceDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveDeviceData {
    id: string;
    type: EXPLOSIVE_DEVICE_TYPE;
    name: string;
    organizationId?: string;
    authorId?: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveDeviceDTO = (value: ICreateValue<IExplosiveDeviceData>): ICreateValue<IExplosiveDeviceDTO> => ({
    type: value.type,
    name: value.name,
});

export const updateExplosiveDeviceDTO = data.createUpdateDTO<IExplosiveDeviceData, IExplosiveDeviceDTO>(value => ({
    type: value?.type ?? EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE,
    name: value?.name ?? '',
}));

export const createExplosiveDevice = (value: IExplosiveDeviceDTO): IExplosiveDeviceData => ({
    id: value.id,
    type: value.type,
    name: value?.name ?? '',
    organizationId: value?.organizationId ?? undefined,
    authorId: value?.authorId ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
