import { type Dayjs } from 'dayjs';

import { type IExplosiveObjectTypeDTOParams, type IExplosiveObjectTypeDTO } from '~/api';
import { data, dates, type ICreateValue } from '~/common';

export interface IExplosiveObjectTypeData {
    id: string;
    name: string;
    fullName: string;
    hasCaliber?: boolean;
    imageUri?: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveObjectTypeDataParams {
    name: string;
    fullName: string;
    hasCaliber?: boolean;
    image?: File;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeDTO): IExplosiveObjectTypeData => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
    hasCaliber: !!value.hasCaliber,
    imageUri: value.imageUri ?? '',
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createExplosiveObjectTypeDTO = (
    value: ICreateValue<IExplosiveObjectTypeDataParams>,
): ICreateValue<IExplosiveObjectTypeDTOParams> => ({
    name: value.name,
    fullName: value.fullName,
    hasCaliber: !!value.hasCaliber,
    image: value.image,
});

export const updateExplosiveObjectTypeDTO = data.createUpdateDTO<IExplosiveObjectTypeDataParams, IExplosiveObjectTypeDTOParams>(value => ({
    name: value.name ?? '',
    fullName: value.fullName ?? '',
    hasCaliber: !!value.hasCaliber,
    image: value?.image ?? undefined,
}));
