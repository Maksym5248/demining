import { type Dayjs } from 'dayjs';

import { type IExplosiveDTOParams, type IExplosiveDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveCompositionData {
    explosiveId: string | null;
    name: string | null;
    percent: number | null;
    description: string | null;
}

export interface IExplosiveData {
    id: string;
    name: string;
    imageUri: string | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    composition: IExplosiveCompositionData[] | null;
    explosive: {
        velocity: number | null; // m/s
        brisantness: number | null; // мм
        explosiveness: number | null; // см³
        tnt: number | null; // см³
    } | null;
    sensitivity: {
        shock: string | null;
        temperature: string | null;
        friction: string | null;
    } | null;
    physical: {
        density: number | null; // г/см3
        meltingPoint: number | null; // °C
        ignitionPoint: number | null; // °C
    } | null;
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
    composition: value.composition
        ? value.composition.map(item => ({
              explosiveId: item.explosiveId ?? null,
              name: item.name ?? null,
              percent: item.percent ?? null,
              description: item.description ?? null,
          }))
        : null,
    explosive: value.explosive
        ? {
              velocity: value?.explosive?.velocity ?? null,
              brisantness: value?.explosive?.brisantness ?? null,
              explosiveness: value?.explosive?.explosiveness ?? null,
              tnt: value?.explosive?.tnt ?? null,
          }
        : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock ?? null,
              temperature: value.sensitivity.temperature ?? null,
              friction: value.sensitivity.friction ?? null,
          }
        : null,
    physical: value.physical
        ? {
              density: value.physical.density ?? null,
              meltingPoint: value.physical.meltingPoint ?? null,
              ignitionPoint: value.physical.ignitionPoint ?? null,
          }
        : null,
});

export const updateExplosiveDTO = data.createUpdateDTO<IExplosiveDataParams, IExplosiveDTOParams>(value => ({
    name: value.name ?? '',
    image: value.image ?? undefined,
    fullName: value.fullName ?? null,
    formula: value.formula ?? null,
    description: value.description ?? null,
    composition: value.composition
        ? value.composition.map(item => ({
              explosiveId: item.explosiveId ?? null,
              percent: item.percent ?? null,
              name: item.name ?? null,
              description: item.description ?? null,
          }))
        : null,
    explosive: value.explosive
        ? {
              velocity: value?.explosive?.velocity ?? null,
              brisantness: value?.explosive?.brisantness ?? null,
              explosiveness: value?.explosive?.explosiveness ?? null,
              tnt: value?.explosive?.tnt ?? null,
          }
        : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock ?? null,
              temperature: value.sensitivity.temperature ?? null,
              friction: value.sensitivity.friction ?? null,
          }
        : null,
    physical: value.physical
        ? {
              density: value.physical.density ?? null,
              meltingPoint: value.physical.meltingPoint ?? null,
              ignitionPoint: value.physical.ignitionPoint ?? null,
          }
        : null,
}));

export const createExplosive = (value: IExplosiveDTO): IExplosiveData => ({
    id: value.id,
    name: value.name,
    imageUri: value.imageUri,
    fullName: value.fullName,
    formula: value.formula,
    description: value.description,
    composition: value.composition
        ? value.composition.map(item => ({
              explosiveId: item.explosiveId ?? null,
              name: item.name ?? null,
              percent: item.percent ?? null,
              description: item.description ?? null,
          }))
        : null,
    explosive: value.explosive
        ? {
              velocity: value?.explosive?.velocity ?? null,
              brisantness: value?.explosive?.brisantness ?? null,
              explosiveness: value?.explosive?.explosiveness ?? null,
              tnt: value?.explosive?.tnt ?? null,
          }
        : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock ?? null,
              temperature: value.sensitivity.temperature ?? null,
              friction: value.sensitivity.friction ?? null,
          }
        : null,
    physical: value.physical
        ? {
              density: value.physical.density ?? null,
              meltingPoint: value.physical.meltingPoint ?? null,
              ignitionPoint: value.physical.ignitionPoint ?? null,
          }
        : null,
    authorId: value.authorId,
    organizationId: value?.organizationId ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
