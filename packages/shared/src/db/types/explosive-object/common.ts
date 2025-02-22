import { type MATERIAL } from '~/db';

export interface IMarkingDB {
    name: string;
}

export interface IFillerDB {
    name: string | null;
    explosiveId: string | null;
    weight: number;
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

export interface ISizeDB {
    /**
     * length or radius
     */
    length: number | null; // m;
    width: number | null; // m;
    height: number | null; // m;
}

export interface IPurposeDB {
    imageUris: string[];
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

export interface ITempartureDB {
    min: number | null;
    max: number | null;
}

export interface IExplosiveObjectDetailsDB {
    fullDescription: string | null;
    imageUris: string[] | null;
    // characteristics
    material: MATERIAL;
    size: ISizeDB | null; //мм;
    weight: number | null; // kg;
    temperature: ITempartureDB | null;
    filler: IFillerDB[] | null; // спорядження ВР;
    caliber: number | null; // ammo
    fuseIds: string[]; // ammo
    fervorIds: string[] | null; // підривник

    // description
    purpose: IPurposeDB | null; // призначення;
    structure: IStructureDB | null; // будова;
    action: IActionDB | null; // принцип дії;

    // fuse
    // liquidator: ILiquidatorDB | false | null;
    // reduction: IReductionDB | false | null;

    // TODO: investigate it
    // marking: IMarkingDB[] // do we need it ? if we have name;
    // neutralization: INeutralizationDB | null;
}
