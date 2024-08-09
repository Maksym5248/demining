import {
    type IExplosiveObjectDetailsDTO,
    type IMarkingDTO,
    type IStructureDTO,
    type IActionDTO,
    type ILiquidatorDTO,
    type IReductionDTO,
    type INeutralizationDTO,
    type IBodyDTO,
    type ISizeDTO,
    type IWightDTO,
    type IPurposeDTO,
} from '~/api';

export type IMarkingData = IMarkingDTO;
export type IStructureData = IStructureDTO;
export type INeutralizationData = INeutralizationDTO;
export type IActionData = IActionDTO;
export type IBodyData = IBodyDTO;
export type ISizeData = ISizeDTO;
export type IWightData = IWightDTO;
export type IPurposeData = IPurposeDTO;
export type ILiquidatorData = ILiquidatorDTO;
export type IReductionData = IReductionDTO;

export interface IExplosiveObjectDetailsData {
    id: string;
    purpose: IPurposeData | null;
    temperatureRange: [number, number] | null;
    imageIds: string[];
    body: IBodyData | null;
    size: ISizeData | null;
    structure: IStructureData | null;
    action: IActionData | null;
    marking: IMarkingData[];
    neutralization: INeutralizationDTO | null;

    // ammo
    weight: IWightData[];
    caliber: number | null;
    fuseIds: string[];

    // fuse
    liquidator: ILiquidatorData | false | null;
    reduction: IReductionData | false | null;
}

export const createExplosiveObjectDetails = (id: string, value: IExplosiveObjectDetailsDTO): IExplosiveObjectDetailsData => {
    return {
        id: id,
        purpose: value.purpose,
        temperatureRange: value.temperatureRange,
        imageIds: [],
        body: value.body,
        size: value.size,
        structure: value.structure,
        action: value.action,
        marking: value.marking,
        neutralization: value.neutralization,
        weight: value.weight,
        caliber: value.caliber,
        fuseIds: value.fuseIds,
        liquidator: value.liquidator,
        reduction: value.reduction,
    };
};
