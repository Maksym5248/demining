import { type MATERIAL } from '~/db';

import { type IDocumentDB } from '../types';

export interface IMarkingDB {
    name: string;
}

export interface IStructureDB {
    description: string;
    imageIds: IDocumentDB[];
}

export interface INeutralizationDB {
    description: string;
}

export interface IActionDB {
    description: string;
    imageIds: string[];
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
