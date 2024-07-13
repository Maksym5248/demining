import {
    type IDestinationDB,
    type IWightDB,
    type IBodyDB,
    type ISizeDB,
    type IStructureDB,
    type IActionDB,
    type IMarkingDB,
    type INeutralizationDB,
} from './common';

export interface IAmmoDB {
    destination: IDestinationDB | null;
    temperatureRange: [number, number] | null;
    imageIds: string[];
    weight: IWightDB[];
    caliber: number | null;
    body: IBodyDB | null;
    size: ISizeDB | null;
    structure: IStructureDB | null;
    action: IActionDB | null;
    fuseIds: string[];
    marking: IMarkingDB[];
    neutralization: INeutralizationDB | null;
}
