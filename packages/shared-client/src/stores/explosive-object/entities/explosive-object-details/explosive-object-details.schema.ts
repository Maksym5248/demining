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
    material: MATERIAL;
    size: ISizeData | null; //мм;
    weight: number | null; // kg;
    temperature: ITempartureData | null;
    filler: IFillerData[] | null; // спорядження ВР;
    caliber: number | null; // ammo
    fuseIds: string[]; // ammo

    // description
    purpose: IPurposeData | null; // призначення;
    structure: IStructureData | null; // будова;
    action: IActionData | null; // принцип дії;
}

export const createExplosiveObjectDetails = (id: string, value: IExplosiveObjectDetailsDTO): IExplosiveObjectDetailsData => {
    return {
        id,
        material: value.material,
        size: value.size,
        weight: value.weight,
        temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
        filler: value.filler,
        caliber: value.caliber,
        fuseIds: value.fuseIds ?? [],
        purpose: value.purpose,
        structure: value.structure,
        action: value.action,
    };
};

export const createExplosiveObjectDetailsDTO = (
    value?: ICreateValue<IExplosiveObjectDetailsData>,
): ICreateValue<IExplosiveObjectDetailsDTO> => ({
    material: value?.material ?? MATERIAL.METAL,
    size: value?.size ?? null,
    weight: value?.weight ?? null,
    temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
    filler:
        value?.filler?.map(el => ({
            explosiveId: el.explosiveId ?? null,
            name: el.name ?? null,
            weight: el.weight ?? null,
        })) ?? null,
    caliber: value?.caliber ?? null,
    fuseIds: value?.fuseIds ?? [],
    purpose: value?.purpose ?? null,
    structure: value?.structure ?? null,
    action: value?.action ?? null,
});

export const updateExplosiveObjectDetailsDTO = data.createUpdateDTO<IExplosiveObjectDetailsData, IExplosiveObjectDetailsDTO>(value => ({
    material: value.material ?? MATERIAL.METAL,
    size: value.size ?? null,
    weight: value.weight ?? null,
    temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
    filler:
        value.filler?.map(el => ({
            explosiveId: el.explosiveId ?? null,
            name: el.name ?? null,
            weight: el.weight ?? null,
        })) ?? null,
    caliber: value.caliber ?? null,
    fuseIds: value.fuseIds ?? [],
    purpose: value.purpose ?? null,
    structure: value.structure ?? null,
    action: value.action ?? null,
}));
