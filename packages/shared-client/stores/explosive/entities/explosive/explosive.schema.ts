import { EXPLOSIVE_TYPE } from '@/shared/db';
import { type Dayjs } from 'dayjs';

import { type IExplosiveDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveValue {
    id: string;
    type: EXPLOSIVE_TYPE;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveDTO = (value: ICreateValue<IExplosiveValue>): ICreateValue<IExplosiveDTO> => ({
    type: value.type,
    name: value.name,
});

export const updateExplosiveDTO = data.createUpdateDTO<IExplosiveValue, IExplosiveDTO>((value) => ({
    type: value?.type ?? EXPLOSIVE_TYPE.EXPLOSIVE,
    name: value?.name ?? '',
}));

export const createExplosive = (value: IExplosiveDTO): IExplosiveValue => ({
    id: value.id,
    type: value.type,
    name: value?.name ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class ExplosiveValue implements IExplosiveValue {
    id: string;
    type: EXPLOSIVE_TYPE;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IExplosiveValue) {
        this.id = value.id;
        this.type = value.type;
        this.name = value.name;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
