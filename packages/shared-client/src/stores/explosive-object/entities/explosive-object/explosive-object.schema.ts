import { type Dayjs } from 'dayjs';
import { EXPLOSIVE_OBJECT_GROUP, EXPLOSIVE_OBJECT_STATUS, MANUFACTURED_COUNTRY } from 'shared-my/db';

import { type IExplosiveObjectDTO, type IExplosiveObjectDTOParams, type IFuseDTO, type IAmmoDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

import { type IAmmoData, createAmmo } from '../ammo';
import { type IFuseData, createFuse } from '../fuse';

export interface IExplosiveObjectData {
    id: string;
    name: string;
    group: EXPLOSIVE_OBJECT_GROUP;
    typeId: string;
    classIds: string[];
    country: MANUFACTURED_COUNTRY;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveObjectDataParams {
    name: string;
    group: EXPLOSIVE_OBJECT_GROUP;
    typeId: string;
    status: EXPLOSIVE_OBJECT_STATUS;
    country: MANUFACTURED_COUNTRY;
    classIds: string[];
    // details: IAmmoData | IFuseData | null;
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectDataParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    name: value?.name ?? null,
    typeId: value.typeId,
    group: value.group,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    country: value.country,
    classIds: value.classIds,
    // details: value.details ?? null,
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectDataParams, IExplosiveObjectDTOParams>((value) => ({
    name: value.name ?? null,
    typeId: value.typeId ?? '',
    group: value.group ?? EXPLOSIVE_OBJECT_GROUP.AMMO,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    country: value.country ?? MANUFACTURED_COUNTRY.USSR,
    classIds: value.classIds ?? [],
    // details: value.details ?? null,
}));

export const createExplosiveObjectDetails = (value: IExplosiveObjectDTO): IAmmoData | IFuseData | null => {
    if (value?.details && value?.group === EXPLOSIVE_OBJECT_GROUP.FUSE) {
        return createFuse(value.details as IFuseDTO);
    }

    if (value?.details && value?.group === EXPLOSIVE_OBJECT_GROUP.AMMO) {
        return createAmmo(value.details as IAmmoDTO);
    }

    return null;
};

export const createExplosiveObject = (value: IExplosiveObjectDTO): IExplosiveObjectData => ({
    id: value.id,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
    typeId: value.typeId,
    classIds: value.classIds ?? [],
    country: value.country ?? MANUFACTURED_COUNTRY.USSR,
    group: value.group,
    name: value?.name ?? '',
});
