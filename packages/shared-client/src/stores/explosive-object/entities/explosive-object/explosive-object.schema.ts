import { type Dayjs } from 'dayjs';
import { isArray } from 'lodash';
import { EXPLOSIVE_OBJECT_COMPONENT, EXPLOSIVE_OBJECT_STATUS } from 'shared-my';

import { type IExplosiveObjectDTO, type IExplosiveObjectDTOParams } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

import { createExplosiveObjectDetailsDTO, type IExplosiveObjectDetailsData } from '../explosive-object-details';

export interface IExplosiveObjectData {
    id: string;
    name: string;
    fullName: string | null;
    description: string | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    component?: EXPLOSIVE_OBJECT_COMPONENT;
    typeId: string;
    classItemIds: string[];
    countryId: string;
    imageUri?: string;
    // detailsId the same as id
    detailsId?: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
    organizationId?: string;
    authorId?: string;
}

export interface IExplosiveObjectDataParams {
    name: string;
    fullName: string | null;
    description: string | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    typeId: string;
    countryId: string;
    classItemIds: string[];
    image?: File;
    details: Omit<IExplosiveObjectDetailsData, 'id'>;
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectDataParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    name: value?.name ?? null,
    fullName: value?.fullName ?? null,
    description: value?.description ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    typeId: value.typeId ?? null,
    component: value.component ?? null,
    countryId: value.countryId ?? null,
    classItemIds: (isArray(value.classItemIds) ? value.classItemIds : [value.classItemIds]).filter(Boolean),
    image: value.image,
    details: createExplosiveObjectDetailsDTO(value.details),
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectDataParams, IExplosiveObjectDTOParams>(value => ({
    name: value.name ?? null,
    fullName: value?.fullName ?? null,
    description: value?.description ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    component: value.component ?? EXPLOSIVE_OBJECT_COMPONENT.AMMO,
    typeId: value.typeId ?? '',
    countryId: value.countryId ?? '',
    classItemIds: (isArray(value.classItemIds) ? value.classItemIds : [value.classItemIds]).filter(Boolean) as string[],
    image: value.image,
    details: createExplosiveObjectDetailsDTO(value.details),
}));

export const createExplosiveObject = (value: IExplosiveObjectDTO): IExplosiveObjectData => ({
    id: value.id,
    fullName: value?.fullName ?? null,
    description: value?.description ?? null,
    component: value.component ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
    typeId: value.typeId ?? '',
    classItemIds: (isArray(value.classItemIds) ? value.classItemIds : [value.classItemIds]).filter(Boolean),
    countryId: value.countryId ?? '',
    name: value?.name ?? '',
    status: value.status,
    imageUri: value.imageUri ?? '',
    detailsId: value.id,
    organizationId: value?.organizationId ?? undefined,
    authorId: value?.authorId ?? undefined,
});
