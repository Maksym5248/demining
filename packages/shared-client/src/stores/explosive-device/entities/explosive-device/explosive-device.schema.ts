import { type Dayjs } from 'dayjs';
import { EXPLOSIVE_DEVICE_TYPE, EXPLOSIVE_OBJECT_STATUS, type MATERIAL } from 'shared-my';

import { type IExplosiveDeviceDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates, data } from '~/common';
import { type IPurposeData, type IFillerData, type IStructureData, type IActionData, type ISizeData } from '~/stores';

import { type ISectionInfoData, type IFieldData } from '../../../type';

export interface IExplosiveDeviceData {
    id: string;
    status: EXPLOSIVE_OBJECT_STATUS;
    type: EXPLOSIVE_DEVICE_TYPE;
    name: string;
    size: ISizeData[] | null;
    imageUri?: string | null;
    imageUris: string[] | null;
    filler: IFillerData[] | null; // спорядження ВР;
    chargeWeight: number | null;
    purpose: IPurposeData | null; // призначення;
    structure: IStructureData | null; // будова;
    action: IActionData | null; // принцип дії;
    organizationId?: string;
    authorId?: string;
    material: MATERIAL[];
    additional: IFieldData[] | null; // додатково
    marking: ISectionInfoData | null; // маркування
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveDeviceDTO = (value: ICreateValue<IExplosiveDeviceData>): ICreateValue<IExplosiveDeviceDTO> => ({
    type: value.type,
    name: value.name,
    material: value.material ?? [],
    sizeV2:
        value?.size?.map(el => ({
            name: el.name ?? null,
            length: el.length ?? null,
            width: el.width ?? null,
            height: el.height ?? null,
            variant: el.variant ?? null,
        })) ?? [],
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    chargeWeight: value.chargeWeight ?? null,
    imageUri: value.imageUri ?? null,
    imageUris: value.imageUris ?? [],
    filler:
        value.filler?.map(item => ({
            name: item?.name ?? null,
            explosiveId: item?.explosiveId ?? null,
            weight: item?.weight ?? null,
            variant: item?.variant ?? null,
            description: item?.description ?? null,
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
    marking: value?.marking
        ? {
              description: value.marking.description ?? null,
              imageUris: value.marking.imageUris ?? [],
          }
        : null,
    additional:
        value?.additional
            ?.filter(el => !!el)
            .map(el => ({
                name: el.name,
                value: el.value,
            })) ?? null,
});

export const updateExplosiveDeviceDTO = data.createUpdateDTO<IExplosiveDeviceData, IExplosiveDeviceDTO>(value => ({
    type: value?.type ?? EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE,
    name: value?.name ?? '',
    material: value.material ?? [],
    sizeV2:
        value?.size?.map(el => ({
            name: el.name ?? null,
            length: el.length ?? null,
            width: el.width ?? null,
            height: el.height ?? null,
            variant: el.variant ?? null,
        })) ?? [],
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    chargeWeight: value.chargeWeight ?? null,
    imageUri: value.imageUri ?? null,
    imageUris: value.imageUris ?? [],
    filler:
        value.filler?.map(item => ({
            name: item?.name ?? null,
            explosiveId: item?.explosiveId ?? null,
            weight: item?.weight ?? null,
            variant: item?.variant ?? null,
            description: item?.description ?? null,
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
    marking: value?.marking
        ? {
              description: value.marking.description ?? null,
              imageUris: value.marking.imageUris ?? [],
          }
        : null,
    additional:
        value?.additional
            ?.filter(el => !!el)
            .map(el => ({
                name: el.name,
                value: el.value,
            })) ?? null,
}));

export const createExplosiveDevice = (value: IExplosiveDeviceDTO): IExplosiveDeviceData => ({
    id: value.id,
    type: value.type,
    name: value?.name ?? '',
    chargeWeight: value.chargeWeight ?? null,
    status: value.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    material: value.material ?? [],
    size:
        value.sizeV2 ??
        (value.size
            ? [
                  {
                      ...value.size,
                      variant: null,
                  },
              ]
            : []),
    imageUri: value.imageUri ?? null,
    imageUris: value.imageUris ?? [],
    filler:
        value.filler?.map(item => ({
            name: item?.name ?? null,
            explosiveId: item?.explosiveId ?? null,
            weight: item?.weight ?? null,
            variant: item?.variant ?? null,
            description: item?.description ?? null,
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
    marking: value?.marking
        ? {
              description: value.marking.description ?? null,
              imageUris: value.marking.imageUris ?? [],
          }
        : null,
    organizationId: value?.organizationId ?? undefined,
    authorId: value?.authorId ?? undefined,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
    additional:
        value?.additional
            ?.filter(el => !!el)
            .map(el => ({
                name: el.name,
                value: el.value,
            })) ?? null,
});
