import { type MATERIAL } from '~/db';

export interface IMarkingDB {
    name: string;
}

export interface IStructureDB {
    description: string;
    imageUris: string[];
}

export interface INeutralizationDB {
    description: string;
}

export interface IActionDB {
    description: string;
    imageUris: string[];
}

export interface IBodyDB {
    material: MATERIAL;
}

export interface ISizeDB {
    type: string;
    times: number[];
}

export interface IWightDB {
    weight: number;
    explosiveName: string;
    explosiveWeight: number;
}

export interface IPurposeDB {
    type: string[];
    description: string;
}

export interface ILiquidatorDB {
    type: string;
    times: number[];
}

export interface IReductionDB {
    type: string;
    times: number[];
}

export interface IExplosiveObjectDetailsDB {
    purpose: IPurposeDB | null;
    temperatureRange: [number, number] | null;
    body: IBodyDB | null;
    size: ISizeDB | null;
    structure: IStructureDB | null;
    action: IActionDB | null;
    marking: IMarkingDB[];
    neutralization: INeutralizationDB | null;

    // ammo
    weight: IWightDB[];
    caliber: number | null;
    fuseIds: string[];

    // fuse
    liquidator: ILiquidatorDB | false | null;
    reduction: IReductionDB | false | null;
}
