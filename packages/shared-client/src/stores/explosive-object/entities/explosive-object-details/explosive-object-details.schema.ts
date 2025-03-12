import { type MATERIAL } from 'shared-my';

import {
    type IExplosiveObjectDetailsDTO,
    type IStructureDTO,
    type IActionDTO,
    type ISizeDTO,
    type IPurposeDTO,
    type IFillerDTO,
    type ITempartureDTO,
    type IWeightDTO,
    type ILiquidatorDTO,
    type IExtractionDTO,
    type IFoldingDTO,
    type IInstallationDTO,
    type INeutralizationDTO,
} from '~/api';
import { data, type ICreateValue } from '~/common';

import { type ISectionInfoData, type IFieldData } from '../../../type';

export type ISizeData = ISizeDTO;
export type IFillerData = IFillerDTO;
export type ITempartureData = ITempartureDTO;

export type IStructureData = IStructureDTO;
export type IPurposeData = IPurposeDTO;
export type IActionData = IActionDTO;
export type IWeightData = IWeightDTO;
export type ILiquidatorData = ILiquidatorDTO;
export type IExtractionData = IExtractionDTO;
export type IFoldingData = IFoldingDTO;
export type IInstallationData = IInstallationDTO;
export type INeutralizationData = INeutralizationDTO;

export interface IExplosiveObjectDetailsData {
    id: string;
    fullDescription: string | null;
    imageUris: string[] | null;
    material: MATERIAL[];
    size: ISizeData[] | null; //мм;
    weight: IWeightData[] | null; // kg;
    temperature: ITempartureData | null;
    filler: IFillerData[] | null; // спорядження ВР;
    caliber: number | null; // ammo
    targetSensor: string | null; // датчик цілі
    sensitivity: string | null; // чутливість
    timeWork: string | null; // час роботи
    liquidatorShort: string | null; // час самоліквідації
    foldingShort: string | null; // час зведення
    extractionShort: string | null; // механізм невилучення
    damage: string | null; // можливе ураження
    fuseIds: string[]; // ammo
    fervorIds: string[]; // запал
    liquidator: ILiquidatorData | null; // ліквідатор;
    extraction: IExtractionData | null; // вилучення / невилучення;
    folding: IFoldingData | null; // складання;
    installation: IInstallationData | null; // спосіб встановлення
    neutralization: INeutralizationData | null; // нейтралізація
    purpose: IPurposeData | null; // призначення;
    structure: IStructureData | null; // будова;
    action: IActionData | null; // принцип дії;
    additional: IFieldData[] | null; // додатково
    marking: ISectionInfoData | null; // маркування
    historical: ISectionInfoData | null; // історичні дані
}

export const createExplosiveObjectDetails = (id: string, value: IExplosiveObjectDetailsDTO): IExplosiveObjectDetailsData => {
    return {
        id,
        fullDescription: value.fullDescription ?? null,
        imageUris: value.imageUris ?? [],
        material: value.materialV2 ?? (value.material ? [value.material] : []),
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
        weight:
            value.weightV2 ??
            (value.weight
                ? [
                      {
                          weight: value.weight,
                          variant: null,
                      },
                  ]
                : []),
        temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
        filler:
            value.filler?.map(item => ({
                name: item.name,
                explosiveId: item.explosiveId,
                weight: item.weight,
                variant: item.variant ?? null,
                description: item.description ?? null,
            })) ?? [],
        caliber: value.caliber,
        fuseIds: value.fuseIds ?? [],
        fervorIds: value.fervorIds ?? [],
        targetSensor: value?.targetSensor ?? null,
        sensitivity: value?.sensitivity ?? null,
        timeWork: value?.timeWork ?? null,
        liquidatorShort: value?.liquidatorShort ?? null,
        extractionShort: value?.extractionShort ?? null,
        foldingShort: value?.foldingShort ?? null,
        damage: value?.damage ?? null,
        liquidator: value?.liquidator
            ? {
                  description: value.liquidator.description ?? null,
                  imageUris: value.liquidator.imageUris ?? [],
              }
            : null,
        installation: value?.installation
            ? {
                  description: value.installation.description ?? null,
                  imageUris: value.installation.imageUris ?? [],
              }
            : null,
        neutralization: value?.neutralization
            ? {
                  description: value.neutralization.description ?? null,
                  imageUris: value.neutralization.imageUris ?? [],
              }
            : null,
        extraction: value?.extraction
            ? {
                  description: value.extraction.description ?? null,
                  imageUris: value.extraction.imageUris ?? [],
              }
            : null,
        folding: value?.folding
            ? {
                  description: value.folding.description ?? null,
                  imageUris: value.folding.imageUris ?? [],
              }
            : null,
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
        historical: value?.historical
            ? {
                  description: value.historical.description ?? null,
                  imageUris: value.historical.imageUris ?? [],
              }
            : null,
        additional:
            value?.additional?.map(el => ({
                name: el.name,
                value: el.value,
            })) ?? null,
    };
};

export const createExplosiveObjectDetailsDTO = (
    value?: ICreateValue<IExplosiveObjectDetailsData>,
): ICreateValue<IExplosiveObjectDetailsDTO> => ({
    imageUris: value?.imageUris ?? [],
    fullDescription: value?.fullDescription ?? null,
    materialV2: value?.material ?? [],
    sizeV2:
        value?.size?.map(el => ({
            name: el.name ?? null,
            length: el.length ?? null,
            width: el.width ?? null,
            height: el.height ?? null,
            variant: el.variant ?? null,
        })) ?? [],
    weightV2: value?.weight?.map((el, i) => ({ weight: el.weight, variant: el.variant ?? i })) ?? [],
    temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
    filler:
        value?.filler?.map(el => ({
            explosiveId: el.explosiveId ?? null,
            name: el.name ?? null,
            weight: el.weight ?? null,
            variant: el.variant ?? null,
            description: el.description ?? null,
        })) ?? null,
    caliber: value?.caliber ?? null,
    fuseIds: value?.fuseIds ?? [],
    fervorIds: value?.fervorIds ?? [],
    targetSensor: value?.targetSensor ?? null,
    sensitivity: value?.sensitivity ?? null,
    timeWork: value?.timeWork ?? null,
    liquidatorShort: value?.liquidatorShort ?? null,
    extractionShort: value?.extractionShort ?? null,
    foldingShort: value?.foldingShort ?? null,
    damage: value?.damage ?? null,
    liquidator: value?.liquidator
        ? {
              description: value.liquidator.description ?? null,
              imageUris: value.liquidator.imageUris ?? [],
          }
        : null,
    neutralization: value?.neutralization
        ? {
              description: value.neutralization.description ?? null,
              imageUris: value.neutralization.imageUris ?? [],
          }
        : null,
    installation: value?.installation
        ? {
              description: value.installation.description ?? null,
              imageUris: value.installation.imageUris ?? [],
          }
        : null,
    extraction: value?.extraction
        ? {
              description: value.extraction.description ?? null,
              imageUris: value.extraction.imageUris ?? [],
          }
        : null,
    folding: value?.folding
        ? {
              description: value.folding.description ?? null,
              imageUris: value.folding.imageUris ?? [],
          }
        : null,
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
    additional:
        value?.additional?.map(el => ({
            name: el.name,
            value: el.value,
        })) ?? null,
    marking: value?.marking
        ? {
              description: value.marking.description ?? null,
              imageUris: value.marking.imageUris ?? [],
          }
        : null,
    historical: value?.historical
        ? {
              description: value.historical.description ?? null,
              imageUris: value.historical.imageUris ?? [],
          }
        : null,
});

export const updateExplosiveObjectDetailsDTO = data.createUpdateDTO<IExplosiveObjectDetailsData, IExplosiveObjectDetailsDTO>(value => ({
    imageUris: value?.imageUris ?? [],
    fullDescription: value?.fullDescription ?? null,
    materialV2: value?.material ?? [],
    sizeV2:
        value?.size?.map(el => ({
            name: el.name ?? null,
            length: el.length ?? null,
            width: el.width ?? null,
            height: el.height ?? null,
            variant: el.variant ?? null,
        })) ?? [],
    weightV2: value?.weight?.map((el, i) => ({ weight: el.weight, variant: el.variant ?? i })) ?? [],
    temperature: value?.temperature ? { max: value?.temperature.max, min: value?.temperature.min } : null,
    targetSensor: value?.targetSensor ?? null,
    sensitivity: value?.sensitivity ?? null,
    timeWork: value?.timeWork ?? null,
    liquidatorShort: value?.liquidatorShort ?? null,
    extractionShort: value?.extractionShort ?? null,
    foldingShort: value?.foldingShort ?? null,
    damage: value?.damage ?? null,
    filler:
        value.filler?.map(el => ({
            explosiveId: el.explosiveId ?? null,
            name: el.name ?? null,
            weight: el.weight ?? null,
            variant: el.variant ?? null,
            description: el.description ?? null,
        })) ?? null,
    caliber: value.caliber ?? null,
    fuseIds: value.fuseIds ?? [],
    fervorIds: value.fervorIds ?? [],
    liquidator: value?.liquidator
        ? {
              description: value.liquidator.description ?? null,
              imageUris: value.liquidator.imageUris ?? [],
          }
        : null,
    installation: value?.installation
        ? {
              description: value.installation.description ?? null,
              imageUris: value.installation.imageUris ?? [],
          }
        : null,
    neutralization: value?.neutralization
        ? {
              description: value.neutralization.description ?? null,
              imageUris: value.neutralization.imageUris ?? [],
          }
        : null,
    extraction: value?.extraction
        ? {
              description: value.extraction.description ?? null,
              imageUris: value.extraction.imageUris ?? [],
          }
        : null,
    folding: value?.folding
        ? {
              description: value.folding.description ?? null,
              imageUris: value.folding.imageUris ?? [],
          }
        : null,
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
    marking: value?.marking
        ? {
              description: value.marking.description ?? null,
              imageUris: value.marking.imageUris ?? [],
          }
        : null,
    additional:
        value?.additional?.map(el => ({
            name: el.name,
            value: el.value,
        })) ?? null,
    historical: value?.historical
        ? {
              description: value.historical.description ?? null,
              imageUris: value.historical.imageUris ?? [],
          }
        : null,
}));
