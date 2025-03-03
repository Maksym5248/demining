import { type Dayjs } from 'dayjs';
import { isNumber } from 'lodash';
import { EXPLOSIVE_OBJECT_STATUS } from 'shared-my';

import { type IExplosiveDTOParams, type IExplosiveDTO, type IRangeDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';

export interface IExplosiveCompositionData {
    explosiveId: string | null;
    name: string | null;
    percent: number | null;
    description: string | null;
}

export interface IRangeData {
    min: number | null;
    max: number | null;
}

export interface IExplosiveData {
    id: string;
    status: EXPLOSIVE_OBJECT_STATUS;
    name: string;
    imageUri: string | null;
    imageUris: string[] | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    composition: IExplosiveCompositionData[] | null;
    explosive: {
        velocity: IRangeData | null; // m/s
        brisantness: IRangeData | null; // m
        explosiveness: IRangeData | null; // m³
        tnt: IRangeData | null; // TNT equivalent
    } | null;
    sensitivity: {
        shock: string | null;
        temperature: string | null;
        friction: string | null;
    } | null;
    physical: {
        density: IRangeData | null; // kg/m³
        meltingPoint: IRangeData | null; // °C
        ignitionPoint: IRangeData | null; // °C
    } | null;
    organizationId?: string;
    authorId: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IExplosiveDataParams extends Omit<IExplosiveData, 'imageUri'> {
    image?: File;
}

const createRange = (value?: IRangeDTO | number | null): IRangeData =>
    ({
        min: (isNumber(value) ? value : value?.min) ?? null,
        max: (isNumber(value) ? null : value?.max) ?? null,
    }) as IRangeData;

const createRangeDTO = (value?: IRangeData | null): IRangeDTO => ({
    min: value?.min ?? null,
    max: value?.max ?? null,
});

export const createExplosiveDTO = (value: ICreateValue<IExplosiveDataParams>): ICreateValue<IExplosiveDTOParams> => ({
    name: value.name,
    image: value.image ?? undefined,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    imageUris: value?.imageUris ?? [],
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
    explosiveV2: value.explosive
        ? {
              velocity: createRangeDTO(value?.explosive?.velocity),
              brisantness: createRangeDTO(value?.explosive?.brisantness),
              explosiveness: createRangeDTO(value?.explosive?.explosiveness),
              tnt: createRangeDTO(value?.explosive?.tnt),
          }
        : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock ?? null,
              temperature: value.sensitivity.temperature ?? null,
              friction: value.sensitivity.friction ?? null,
          }
        : null,
    physicalV2: value.physical
        ? {
              density: createRangeDTO(value.physical.density),
              meltingPoint: createRangeDTO(value.physical.meltingPoint),
              ignitionPoint: createRangeDTO(value.physical.ignitionPoint),
          }
        : null,
});

export const updateExplosiveDTO = data.createUpdateDTO<IExplosiveDataParams, IExplosiveDTOParams>(value => ({
    imageUris: value?.imageUris ?? [],
    name: value.name ?? '',
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
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
    explosiveV2: value.explosive
        ? {
              velocity: createRangeDTO(value?.explosive?.velocity),
              brisantness: createRangeDTO(value?.explosive?.brisantness),
              explosiveness: createRangeDTO(value?.explosive?.explosiveness),
              tnt: createRangeDTO(value?.explosive?.tnt),
          }
        : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock ?? null,
              temperature: value.sensitivity.temperature ?? null,
              friction: value.sensitivity.friction ?? null,
          }
        : null,
    physicalV2: value.physical
        ? {
              density: createRangeDTO(value.physical.density),
              meltingPoint: createRangeDTO(value.physical.meltingPoint),
              ignitionPoint: createRangeDTO(value.physical.ignitionPoint),
          }
        : null,
}));

export const createExplosive = (value: IExplosiveDTO): IExplosiveData => ({
    id: value.id,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    name: value.name,
    imageUri: value.imageUri,
    imageUris: value?.imageUris ?? [],
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
    explosive:
        value.explosiveV2 || value.explosive
            ? {
                  velocity: createRange(value?.explosiveV2?.velocity ?? value?.explosive?.velocity),
                  brisantness: createRange(value?.explosiveV2?.brisantness ?? value?.explosive?.brisantness),
                  explosiveness: createRange(value?.explosiveV2?.explosiveness ?? value?.explosive?.explosiveness),
                  tnt: createRange(value?.explosiveV2?.tnt ?? value?.explosive?.tnt),
              }
            : null,
    sensitivity: value.sensitivity
        ? {
              shock: value.sensitivity.shock ?? null,
              temperature: value.sensitivity.temperature ?? null,
              friction: value.sensitivity.friction ?? null,
          }
        : null,
    physical:
        value.physicalV2 || value.physical
            ? {
                  density: createRange(value.physicalV2?.density ?? value.physical?.density),
                  meltingPoint: createRange(value.physicalV2?.meltingPoint ?? value.physical?.meltingPoint),
                  ignitionPoint: createRange(value.physicalV2?.ignitionPoint ?? value.physical?.ignitionPoint),
              }
            : null,
    authorId: value.authorId,
    organizationId: value?.organizationId ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
