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
    imageUri?: string;
    // detailsId the same as id
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
    image?: File;
    details: {
        caliber?: number;
    };
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectDataParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    name: value?.name ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    typeId: value.typeId ?? null,
    groupId: value.groupId ?? null,
    component: value.component ?? null,
    countryId: value.countryId ?? null,
    classIds: value.classIds ?? [],
    image: value.image,
    details: {
        caliber: value.details.caliber ?? null,
        purpose: null,
        temperatureRange: null,
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
    image: value.image,
    details: {
        imageUri: value?.image ?? null,
        caliber: value.details?.caliber ?? null,
        purpose: null,
        temperatureRange: null,
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
    imageUri: value.imageUri ?? '',
    detailsId: value.id,
});
