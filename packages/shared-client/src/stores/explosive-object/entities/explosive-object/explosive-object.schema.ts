import { type Dayjs } from 'dayjs';

import { type IExplosiveObjectDTO, type IExplosiveObjectDTOParams } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveObjectData {
    id: string;
    typeId: string;
    name?: string;
    caliber?: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveObjectDataParams {
    id: string;
    typeId: string;
    name?: string;
    caliber?: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectDataParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    typeId: value.typeId,
    name: value?.name ?? null,
    caliber: value?.caliber ?? null,
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectDataParams, IExplosiveObjectDTOParams>((value) => ({
    typeId: value?.typeId ?? '',
    name: value?.name ?? null,
    caliber: value?.caliber ?? null,
}));

export const createExplosiveObject = (value: IExplosiveObjectDTO): IExplosiveObjectData => ({
    id: value.id,
    typeId: value.typeId,
    name: value?.name ?? '',
    caliber: value?.caliber ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
