import { type IRangeDB, type MATERIAL } from 'shared-my';

import { type IExplosiveObjectDetailsDTO, type ISizeDTO, type IFillerDTO, type IWeightDTO } from '~/api';
import { data, type ICreateValue } from '~/common';
import { createRange, createRangeDTO } from '~/stores/utils';

import { type ISectionInfoData, type IFieldData, type IRangeData } from '../../../type';

export type ISizeData = ISizeDTO;
export type IFillerData = IFillerDTO;
export type IWeightData = IWeightDTO;

export type IDamageData = {
    radius: IRangeData | null; // радіус суцільного ураження
    distance: IRangeData | null; // дальність дольоту осколків
    squad: IRangeData | null; // площа ураження;
    height: IRangeData | null; // висота ураження;
    number: IRangeData | null; // кількість
    action: string | null; // вражаюча дія;
    additional: IFieldData[] | null; // додатково
};

export type ISensitivityData = {
    effort: IRangeDB | null; // зусилля, кг
    sensitivity: string | null; // чутливість
    additional: IFieldData[] | null; // додатково
};

export interface IExplosiveObjectDetailsData {
    id: string;
    fullDescription: string | null;
    imageUris: string[] | null;
    material: MATERIAL[];
    size: ISizeData[] | null; //мм;
    weight: IWeightData[] | null; // kg;
    temperature: IRangeData | null;
    filler: IFillerData[] | null; // спорядження ВР;
    caliber: number | null; // ammo
    targetSensor: string | null; // підривник
    sensitivity: ISensitivityData | null; // чутливість
    timeWork: string | null; // час роботи
    liquidatorShort: string | null; // час самоліквідації
    foldingShort: string | null; // час зведення
    extractionShort: string | null; // механізм невилучення
    damage: null | IDamageData;
    fuseIds: string[]; // ammo
    fervorIds: string[]; // запал
    liquidator: ISectionInfoData | null; // ліквідатор;
    extraction: ISectionInfoData | null; // вилучення / невилучення;
    folding: ISectionInfoData | null; // складання;
    installation: ISectionInfoData | null; // спосіб встановлення
    neutralization: ISectionInfoData | null; // нейтралізація
    purpose: ISectionInfoData | null; // призначення;
    structure: ISectionInfoData | null; // будова;
    action: ISectionInfoData | null; // принцип дії;
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
        sensitivity: {
            effort: createRange(value?.sensitivityV2?.effort) ?? null,
            sensitivity: value?.sensitivityV2?.sensitivity ?? value?.sensitivity ?? null,
            additional: value?.sensitivityV2?.additional ?? null,
        },
        timeWork: value?.timeWork ?? null,
        liquidatorShort: value?.liquidatorShort ?? null,
        extractionShort: value?.extractionShort ?? null,
        foldingShort: value?.foldingShort ?? null,
        damage: {
            radius: createRange(value?.damageV2?.radius) ?? null,
            distance: createRange(value?.damageV2?.distance) ?? null,
            squad: createRange(value?.damageV2?.squad) ?? null,
            height: createRange(value?.damageV2?.height) ?? null,
            number: createRange(value?.damageV2?.number) ?? null,
            action: value?.damageV2?.action ?? null,
            additional:
                value?.damageV2?.additional?.filter(Boolean).map(el => ({
                    name: el.name,
                    value: el.value,
                })) ?? null,
        },
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
    sensitivityV2: {
        effort: createRangeDTO(value?.sensitivity?.effort) ?? null,
        sensitivity: value?.sensitivity?.sensitivity ?? null,
        additional: value?.sensitivity?.additional ?? null,
    },
    timeWork: value?.timeWork ?? null,
    liquidatorShort: value?.liquidatorShort ?? null,
    extractionShort: value?.extractionShort ?? null,
    foldingShort: value?.foldingShort ?? null,
    damageV2: {
        radius: createRangeDTO(value?.damage?.radius) ?? null,
        distance: createRangeDTO(value?.damage?.distance) ?? null,
        squad: createRangeDTO(value?.damage?.squad) ?? null,
        height: createRangeDTO(value?.damage?.height) ?? null,
        number: createRangeDTO(value?.damage?.number) ?? null,
        action: value?.damage?.action ?? null,
        additional:
            value?.damage?.additional?.filter(Boolean).map(el => ({
                name: el.name,
                value: el.value,
            })) ?? null,
    },
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
    sensitivityV2: {
        effort: createRangeDTO(value?.sensitivity?.effort) ?? null,
        sensitivity: value?.sensitivity?.sensitivity ?? null,
        additional: value?.sensitivity?.additional ?? null,
    },
    timeWork: value?.timeWork ?? null,
    liquidatorShort: value?.liquidatorShort ?? null,
    extractionShort: value?.extractionShort ?? null,
    foldingShort: value?.foldingShort ?? null,
    damageV2: {
        radius: createRangeDTO(value?.damage?.radius) ?? null,
        distance: createRangeDTO(value?.damage?.distance) ?? null,
        squad: createRangeDTO(value?.damage?.squad) ?? null,
        height: createRangeDTO(value?.damage?.height) ?? null,
        number: createRangeDTO(value?.damage?.number) ?? null,
        action: value?.damage?.action ?? null,
        additional:
            value?.damage?.additional?.filter(Boolean).map(el => ({
                name: el.name,
                value: el.value,
            })) ?? null,
    },
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
