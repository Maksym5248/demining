import { type Dayjs } from 'dayjs';
import { EXPLOSIVE_OBJECT_COMPONENT, EXPLOSIVE_OBJECT_STATUS } from 'shared-my/db';

import { type IExplosiveObjectDTO, type IExplosiveObjectDTOParams } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveObjectData {
    id: string;
    name: string;
    component?: EXPLOSIVE_OBJECT_COMPONENT;
    groupId?: string;
    typeId: string;
    classIds: string[];
    countryId: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveObjectDataParams {
    name: string;
    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    groupId: string;
    typeId: string;
    countryId: string;
    classIds: string[];
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectDataParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    name: value?.name ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    typeId: value.typeId,
    groupId: value.groupId,
    component: value.component,
    countryId: value.countryId,
    classIds: value.classIds,
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectDataParams, IExplosiveObjectDTOParams>((value) => ({
    name: value.name ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    component: value.component ?? EXPLOSIVE_OBJECT_COMPONENT.AMMO,
    typeId: value.typeId ?? '',
    groupId: value.groupId ?? '',
    countryId: value.countryId ?? '',
    classIds: value.classIds ?? [],
    // details: value.details ?? null,
}));

export const createExplosiveObject = (value: IExplosiveObjectDTO): IExplosiveObjectData => ({
    id: value.id,
    component: value.component ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
    typeId: value.typeId,
    classIds: value.classIds ?? [],
    countryId: value.countryId ?? '',
    groupId: value.groupId ?? undefined,
    name: value?.name ?? '',
});
