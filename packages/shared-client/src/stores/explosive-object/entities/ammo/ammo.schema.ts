import {
    type IMarkingDTO,
    type IStructureDTO,
    type IActionDTO,
    type INeutralizationDTO,
    type IAmmoDTO,
    type IDestinationDTO,
    type IWightDTO,
    type IBodyDTO,
    type ISizeDTO,
} from '~/api';

export interface IAmmoData {
    destination: IDestinationDTO | null;
    temperatureRange: [number, number] | null;
    imageIds: string[];
    weight: IWightDTO[];
    caliber: number | null;
    body: IBodyDTO | null;
    size: ISizeDTO | null;
    structure: IStructureDTO | null;
    action: IActionDTO | null;
    fuseIds: string[];
    marking: IMarkingDTO[];
    neutralization: INeutralizationDTO | null;
}

export const createAmmo = (value: IAmmoDTO): IAmmoData => {
    return {
        destination: value.destination,
        temperatureRange: value.temperatureRange,
        imageIds: value.imageIds,
        weight: value.weight,
        caliber: value.caliber,
        body: value.body,
        size: value.size,
        structure: value.structure,
        action: value.action,
        fuseIds: value.fuseIds,
        marking: value.marking,
        neutralization: value.neutralization,
    };
};
