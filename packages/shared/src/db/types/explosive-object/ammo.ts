import { type AMMO_TYPE, type MATERIAL } from '~/db';

import { type IStructure, type IMarking, type INeutralization, type IAction } from './common';

interface ISize {
    type: string;
    times: number[];
}

interface IWight {
    weight: number;
    explosiveName: string;
    explosiveWeight: number;
}

interface IBody {
    material: MATERIAL;
}

interface IDestination {
    type: string[];
    description: string;
}

export interface IAmmoDB {
    type: AMMO_TYPE;
    destination: IDestination;
    temperatureRange: [number, number];
    imageIds: string[];
    weight: IWight[];
    caliber: number | null;
    body: IBody | null;
    size: ISize | null;
    structure: IStructure;
    action: IAction;
    fuseIds: string[];
    marking: IMarking[];
    neutralization: INeutralization;
}
