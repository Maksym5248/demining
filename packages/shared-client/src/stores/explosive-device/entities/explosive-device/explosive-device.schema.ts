import { type Dayjs } from 'dayjs';
import { EXPLOSIVE_DEVICE_TYPE } from 'shared-my';

import { type IExplosiveDeviceDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';
import { type IPurposeData, type IFillerData, type IStructureData, type IActionData, type ISizeData } from '~/stores';

export interface IExplosiveDeviceData {
    id: string;
    type: EXPLOSIVE_DEVICE_TYPE;
    name: string;
    size: ISizeData | null;
    imageUri?: string | null;
    imageUris: string[] | null;
    filler: IFillerData[] | null; // спорядження ВР;
    chargeWeight: number | null;
    purpose: IPurposeData | null; // призначення;
    structure: IStructureData | null; // будова;
    action: IActionData | null; // принцип дії;
    organizationId?: string;
    authorId?: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveDeviceDTO = (value: ICreateValue<IExplosiveDeviceData>): ICreateValue<IExplosiveDeviceDTO> => ({
    type: value.type,
    name: value.name,
    size: value.size,
    chargeWeight: value.chargeWeight,
    imageUri: value.imageUri ?? null,
    imageUris: value.imageUris ?? [],
    filler:
        value.filler?.map(item => ({
            name: item?.name ?? null,
            explosiveId: item?.explosiveId ?? null,
            weight: item?.weight ?? null,
        })) ?? [],
    purpose: value?.purpose
        ? {
              description: value.purpose.description ?? null,
              imageUris: value.purpose.imageUris ?? [],
          }
        : null,
    structure: value?.structure
        ? {
              description: value.structure.description ?? null,
              imageUris: value.structure.imageUris ?? [],
          }
        : null,
    action: value?.action
        ? {
              description: value.action.description ?? null,
              imageUris: value.action.imageUris ?? [],
          }
        : null,
});

export const updateExplosiveDeviceDTO = data.createUpdateDTO<IExplosiveDeviceData, IExplosiveDeviceDTO>(value => ({
    type: value?.type ?? EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE,
    name: value?.name ?? '',
    size: value.size ?? null,
    chargeWeight: value.chargeWeight ?? null,
    imageUri: value.imageUri ?? null,
    imageUris: value.imageUris ?? [],
    filler:
        value.filler?.map(item => ({
            name: item?.name ?? null,
            explosiveId: item?.explosiveId ?? null,
            weight: item?.weight ?? null,
        })) ?? [],
    purpose: value?.purpose
        ? {
              description: value.purpose.description ?? null,
              imageUris: value.purpose.imageUris ?? [],
          }
        : null,
    structure: value?.structure
        ? {
              description: value.structure.description ?? null,
              imageUris: value.structure.imageUris ?? [],
          }
        : null,
    action: value?.action
        ? {
              description: value.action.description ?? null,
              imageUris: value.action.imageUris ?? [],
          }
        : null,
}));

export const createExplosiveDevice = (value: IExplosiveDeviceDTO): IExplosiveDeviceData => ({
    id: value.id,
    type: value.type,
    name: value?.name ?? '',
    chargeWeight: value.chargeWeight ?? null,
    size: value.size ?? null,
    imageUri: value.imageUri ?? null,
    imageUris: value.imageUris ?? [],
    filler:
        value.filler?.map(item => ({
            name: item?.name ?? null,
            explosiveId: item?.explosiveId ?? null,
            weight: item?.weight ?? null,
        })) ?? [],
    purpose: value?.purpose
        ? {
              description: value.purpose.description ?? null,
              imageUris: value.purpose.imageUris ?? [],
          }
        : null,
    structure: value?.structure
        ? {
              description: value.structure.description ?? null,
              imageUris: value.structure.imageUris ?? [],
          }
        : null,
    action: value?.action
        ? {
              description: value.action.description ?? null,
              imageUris: value.action.imageUris ?? [],
          }
        : null,
    organizationId: value?.organizationId ?? undefined,
    authorId: value?.authorId ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
