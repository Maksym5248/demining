import { type Dayjs } from 'dayjs';

import { type IExplosiveObjectTypeDTO } from '~/api';
import { data, dates, type ICreateValue } from '~/common';

export interface IExplosiveObjectTypeData {
    id: string;
    name: string;
    fullName: string;
    hasCaliber?: boolean;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeDTO): IExplosiveObjectTypeData => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
    hasCaliber: !!value.hasCaliber,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createExplosiveObjectTypeDTO = (value: ICreateValue<IExplosiveObjectTypeData>): ICreateValue<IExplosiveObjectTypeDTO> => ({
    name: value.name,
    fullName: value.fullName,
    hasCaliber: !!value.hasCaliber,
});

export const updateExplosiveObjectTypeDTO = data.createUpdateDTO<IExplosiveObjectTypeData, IExplosiveObjectTypeDTO>(value => ({
    name: value.name ?? '',
    fullName: value.fullName ?? '',
    hasCaliber: !!value.hasCaliber,
}));
