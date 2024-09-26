import { type Dayjs } from 'dayjs';
import { EXPLOSIVE_TYPE } from 'shared-my';

import { type IExplosiveDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveData {
    id: string;
    type: EXPLOSIVE_TYPE;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveDTO = (value: ICreateValue<IExplosiveData>): ICreateValue<IExplosiveDTO> => ({
    type: value.type,
    name: value.name,
});

export const updateExplosiveDTO = data.createUpdateDTO<IExplosiveData, IExplosiveDTO>((value) => ({
    type: value?.type ?? EXPLOSIVE_TYPE.EXPLOSIVE,
    name: value?.name ?? '',
}));

export const createExplosive = (value: IExplosiveDTO): IExplosiveData => ({
    id: value.id,
    type: value.type,
    name: value?.name ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
