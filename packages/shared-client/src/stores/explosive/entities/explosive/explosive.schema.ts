import { type Dayjs } from 'dayjs';

import { type IExplosiveDTOParams, type IExplosiveDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveСompositionData {
    explosiveId: string | null;
    name: string | null;
    persent: number | null;
}

export interface IExplosiveData {
    id: string;
    name: string;
    imageUri: string | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    composition: IExplosiveСompositionData[] | null;
    detonation: {
        velocity: number | null; // m/s
    } | null;
    sensitivity: {
        shock: string | null;
        tempurture: string | null;
    } | null;
    density: number | null; // г/см3
    organizationId?: string;
    authorId: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveDataParams extends Omit<IExplosiveData, 'imageUri'> {
    image?: File;
}

export const createExplosiveDTO = (value: ICreateValue<IExplosiveDataParams>): ICreateValue<IExplosiveDTOParams> => ({
    name: value.name,
    image: value.image ?? undefined,
    fullName: value.fullName ?? null,
    formula: value.formula ?? null,
    description: value.description ?? null,
    composition: value.composition ?? null,
    detonation: value.detonation ? { velocity: value?.detonation?.velocity } : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock,
              tempurture: value.sensitivity.tempurture,
          }
        : null,
    density: value.density ?? null,
});

export const updateExplosiveDTO = data.createUpdateDTO<IExplosiveDataParams, IExplosiveDTOParams>(value => ({
    name: value.name ?? '',
    image: value.image ?? undefined,
    fullName: value.fullName ?? null,
    formula: value.formula ?? null,
    description: value.description ?? null,
    composition: value.composition ?? null,
    detonation: value.detonation ? { velocity: value?.detonation?.velocity } : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock,
              tempurture: value.sensitivity.tempurture,
          }
        : null,
    density: value.density ?? null,
}));

export const createExplosive = (value: IExplosiveDTO): IExplosiveData => ({
    id: value.id,
    name: value.name,
    imageUri: value.imageUri,
    fullName: value.fullName,
    formula: value.formula,
    description: value.description,
    composition: value.composition,
    detonation: value.detonation ? { velocity: value?.detonation?.velocity } : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock,
              tempurture: value.sensitivity.tempurture,
          }
        : null,
    density: value.density,
    authorId: value.authorId,
    organizationId: value?.organizationId ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
