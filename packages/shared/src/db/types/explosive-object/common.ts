import { type IFieldDB, type MATERIAL } from '~/db';

export interface IFillerDB {
    name: string | null;
    explosiveId: string | null;
    weight: number;
    variant: number;
    description?: string | null;
}

export interface IStructureDB {
    description: string;
    imageUris: string[];
}

export interface INeutralizationDB {
    description: string;
    imageUris: string[];
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
    imageUris: string[];
    description: string;
}

export interface IFoldingDB {
    imageUris: string[];
    description: string;
}

export interface IExtractionDB {
    imageUris: string[];
    description: string;
}

export interface IInstallationDB {
    imageUris: string[];
    description: string;
}

export interface ITempartureDB {
    min: number | null;
    max: number | null;
}

export interface IWeightDB {
    weight: number; // kg;
    variant: number | null;
}

export interface IExplosiveObjectDetailsDB {
    fullDescription: string | null;
    imageUris: string[] | null;
    // characteristics
    /**
     * @deprecated
     */
    material?: MATERIAL;
    materialV2: MATERIAL[];

    /**
     * @deprecated
     */
    size?: ISizeDB | null; //м;
    /**
     * @deprecated
     */
    weight?: number | null; // kg
    sizeV2: ISizeDB[] | null; //м;
    weightV2: IWeightDB[] | null;
    temperature: ITempartureDB | null;
    filler: IFillerDB[] | null; // спорядження ВР;
    caliber: number | null; // ammo
    fuseIds: string[]; // ammo
    fervorIds: string[] | null; // підривник

    // description
    purpose: IPurposeDB | null; // призначення/ураження;
    structure: IStructureDB | null; // будова;
    action: IActionDB | null; // принцип дії;
    installation: IInstallationDB | null; // спосіб встановлення
    liquidator?: ILiquidatorDB | null; // самоліквідатор
    extraction?: IExtractionDB | null; // механізм невилучення
    folding?: IFoldingDB | null; // механізм зведення
    neutralization: INeutralizationDB | null; // нейтралізація

    // fuse
    targetSensor: string | null; // датчик цілі
    sensitivity: string | null; // чутливість
    timeWork: string | null; // час роботи
    additional: IFieldDB[] | null; // додатково
}
