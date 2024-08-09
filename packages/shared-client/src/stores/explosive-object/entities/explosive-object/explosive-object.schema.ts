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
    detailsId?: string;
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
    caliber?: number;
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectDataParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    name: value?.name ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    typeId: value.typeId ?? null,
    groupId: value.groupId ?? null,
    component: value.component ?? null,
    countryId: value.countryId ?? null,
    classIds: value.classIds ?? [],
    details: {
        caliber: value.caliber ?? null,
        purpose: null,
        temperatureRange: null,
        imageIds: [],
        body: null,
        size: null,
        structure: null,
        action: null,
        marking: [],
        neutralization: null,
        weight: [],
        fuseIds: [],
        liquidator: null,
        reduction: null,
    },
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectDataParams, IExplosiveObjectDTOParams>((value) => ({
    name: value.name ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    component: value.component ?? EXPLOSIVE_OBJECT_COMPONENT.AMMO,
    typeId: value.typeId ?? '',
    groupId: value.groupId ?? '',
    countryId: value.countryId ?? '',
    classIds: value.classIds ?? [],
    details: {
        caliber: value.caliber ?? null,
        purpose: null,
        temperatureRange: null,
        imageIds: [],
        body: null,
        size: null,
        structure: null,
        action: null,
        marking: [],
        neutralization: null,
        weight: [],
        fuseIds: [],
        liquidator: null,
        reduction: null,
    },
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
    detailsId: value.id,
});
