import {
    type ISizeDB,
    type IBaseDB,
    type IFillerDB,
    type ISectionInfoDB,
    type IFieldDB,
    type ILinkedToDocumentDB,
    type Timestamp,
    type IMapDB,
} from './common';
import { type EXPLOSIVE_DEVICE_TYPE, type MATERIAL, type APPROVE_STATUS } from '../enum';

export interface IExplosiveDeviceTypeDB extends IMapDB {
    id: EXPLOSIVE_DEVICE_TYPE;
    name: string;
}

export interface IExplosiveDeviceDB extends IBaseDB {
    status?: APPROVE_STATUS;
    name: string;
    type: EXPLOSIVE_DEVICE_TYPE;
    material: MATERIAL[];
    /** @deprecated */
    size?: ISizeDB | null; //м;
    sizeV2: ISizeDB[] | null; //м;
    imageUri?: string | null;
    imageUris?: string[] | null;
    filler?: IFillerDB[] | null; // спорядження ВР;
    chargeWeight?: number | null;
    purpose?: ISectionInfoDB | null; // призначення;
    structure?: ISectionInfoDB | null; // будова;
    action?: ISectionInfoDB | null; // принцип дії;
    additional: IFieldDB[] | null; // додатково
    marking: ISectionInfoDB | null; // маркування
    usage: ISectionInfoDB | null; // використання
    authorId: string;
}

export interface IExplosiveDeviceActionDB extends IExplosiveDeviceDB, ILinkedToDocumentDB {
    explosiveId: string;
    weight: number | null /* in kilograms */;
    quantity: number | null;
    executedAt: Timestamp;
}
