import { MATERIAL } from 'shared-my';

import {
    type IExplosiveObjectDetailsDTO,
    type IStructureDTO,
    type IActionDTO,
    type ISizeDTO,
    type IPurposeDTO,
    type IFillerDTO,
    type ITempartureDTO,
} from '~/api';
import { data, type ICreateValue } from '~/common';

export type ISizeData = ISizeDTO;
export type IFillerData = IFillerDTO;
export type ITempartureData = ITempartureDTO;

export type IStructureData = IStructureDTO;
export type IPurposeData = IPurposeDTO;
export type IActionData = IActionDTO;

export interface IExplosiveObjectDetailsData {
    id: string;
    fullDescription: string | null;
    imageUris: string[] | null;
    material: MATERIAL;
    size: ISizeData | null; //мм;
    weight: number | null; // kg;
    temperature: ITempartureData | null;
    filler: IFillerData[] | null; // спорядження ВР;
    caliber: number | null; // ammo
    fuseIds: string[]; // ammo
    fervorIds: string[]; // запал

    // description
    purpose: IPurposeData | null; // призначення;
    structure: IStructureData | null; // будова;
    action: IActionData | null; // принцип дії;
}

export const createExplosiveObjectDetails = (id: string, value: IExplosiveObjectDetailsDTO): IExplosiveObjectDetailsData => {
    return {
        id,
        fullDescription: value.fullDescription ?? null,
        imageUris: value.imageUris ?? [],
        material: value.material,
        size: value.size,
        weight: value.weight,
        temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
        filler:
            value.filler?.map(item => ({
                name: item.name,
                explosiveId: item.explosiveId,
                weight: item.weight,
                variant: item.variant ?? 1,
            })) ?? [],
        caliber: value.caliber,
        fuseIds: value.fuseIds ?? [],
        fervorIds: value.fervorIds ?? [],
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
    };
};

export const createExplosiveObjectDetailsDTO = (
    value?: ICreateValue<IExplosiveObjectDetailsData>,
): ICreateValue<IExplosiveObjectDetailsDTO> => ({
    imageUris: value?.imageUris ?? [],
    fullDescription: value?.fullDescription ?? null,
    material: value?.material ?? MATERIAL.METAL,
    size: value?.size ?? null,
    weight: value?.weight ?? null,
    temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
    filler:
        value?.filler?.map(el => ({
            explosiveId: el.explosiveId ?? null,
            name: el.name ?? null,
            weight: el.weight ?? null,
            variant: el.variant ?? 1,
        })) ?? null,
    caliber: value?.caliber ?? null,
    fuseIds: value?.fuseIds ?? [],
    fervorIds: value?.fervorIds ?? [],
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

export const updateExplosiveObjectDetailsDTO = data.createUpdateDTO<IExplosiveObjectDetailsData, IExplosiveObjectDetailsDTO>(value => ({
    imageUris: value?.imageUris ?? [],
    fullDescription: value?.fullDescription ?? null,
    material: value.material ?? MATERIAL.METAL,
    size: value.size ?? null,
    weight: value.weight ?? null,
    temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
    filler:
        value.filler?.map(el => ({
            explosiveId: el.explosiveId ?? null,
            name: el.name ?? null,
            weight: el.weight ?? null,
            variant: el.variant ?? 1,
        })) ?? null,
    caliber: value.caliber ?? null,
    fuseIds: value.fuseIds ?? [],
    fervorIds: value.fervorIds ?? [],
    purpose: value.purpose
        ? {
              description: value.purpose.description ?? null,
              imageUris: value.purpose.imageUris ?? [],
          }
        : null,
    structure: value.structure
        ? {
              description: value.structure.description ?? null,
              imageUris: value.structure.imageUris ?? [],
          }
        : null,
    action: value.action
        ? {
              description: value.action.description ?? null,
              imageUris: value.action.imageUris ?? [],
          }
        : null,
}));
