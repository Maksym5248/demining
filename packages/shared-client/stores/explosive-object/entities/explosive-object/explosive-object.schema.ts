import { type Dayjs } from 'dayjs';

import { type IExplosiveObjectDTO, type IExplosiveObjectDTOParams } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveObjectValue {
    id: string;
    typeId: string;
    name?: string;
    caliber?: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveObjectValueParams {
    id: string;
    typeId: string;
    name?: string;
    caliber?: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectValueParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    typeId: value.typeId,
    name: value?.name ?? null,
    caliber: value?.caliber ?? null,
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectValueParams, IExplosiveObjectDTOParams>((value) => ({
    typeId: value?.typeId ?? '',
    name: value?.name ?? null,
    caliber: value?.caliber ?? null,
}));

export const createExplosiveObject = (value: IExplosiveObjectDTO): IExplosiveObjectValue => ({
    id: value.id,
    typeId: value.typeId,
    name: value?.name ?? '',
    caliber: value?.caliber ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class ExplosiveObjectValue implements IExplosiveObjectValue {
    id: string;
    typeId: string;
    name?: string;
    caliber?: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IExplosiveObjectValue) {
        this.id = value.id;
        this.typeId = value.typeId;
        this.name = value.name;
        this.caliber = value.caliber;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
