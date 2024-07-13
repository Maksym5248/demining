import { type Dayjs } from 'dayjs';
import { EXPLOSIVE_OBJECT_GROUP, EXPLOSIVE_OBJECT_STATUS } from 'shared-my/db';

import { type IExplosiveObjectDTO, type IExplosiveObjectDTOParams, type IFuseDTO, type IAmmoDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

import { type IAmmoData, createAmmo } from '../ammo';
import { type IFuseData, createFuse } from '../fuse';

export interface IExplosiveObjectData {
    id: string;
    name: string;
    group: EXPLOSIVE_OBJECT_GROUP;
    typeIds: string[];
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveObjectDataParams {
    name: string;
    group: EXPLOSIVE_OBJECT_GROUP;
    typeIds: string[];
    status: EXPLOSIVE_OBJECT_STATUS;
    // details: IAmmoData | IFuseData | null;
}

export const createExplosiveObjectDTO = (value: ICreateValue<IExplosiveObjectDataParams>): ICreateValue<IExplosiveObjectDTOParams> => ({
    name: value?.name ?? null,
    typeIds: value.typeIds,
    group: value.group,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    // details: value.details ?? null,
});

export const updateExplosiveObjectDTO = data.createUpdateDTO<IExplosiveObjectDataParams, IExplosiveObjectDTOParams>((value) => ({
    name: value?.name ?? null,
    typeIds: value.typeIds ?? [],
    group: value.group ?? EXPLOSIVE_OBJECT_GROUP.AMMO,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
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
    typeIds: value.typeIds,
    group: value.group,
    name: value?.name ?? '',
});
