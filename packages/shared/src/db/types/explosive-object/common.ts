import { type MATERIAL } from '~/db';

export interface IFillerDB {
    name: string | null;
    explosiveId: string | null;
    weight: number;
    variant: number;
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
    variant: number | null;
    name?: string | null;
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

export interface IWeightDB {
    weight: number; // kg;
    variant: number;
}

export interface IExplosiveObjectDetailsDB {
    fullDescription: string | null;
    imageUris: string[] | null;
    // characteristics
    material: MATERIAL;
    /**
     * @deprecated
     */
    size?: ISizeDB | null; //мм;
    /**
     * @deprecated
     */
    weight?: number | null; // kg
    sizeV2: ISizeDB[] | null; //мм;
    weightV2: IWeightDB[] | null;
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
    // neutralization: INeutralizationDB | null;
}
