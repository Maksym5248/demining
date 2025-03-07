import { type ILinkedToDocumentDB, type IBaseDB, type Timestamp, type IFieldDB, type ISectionInfoDB } from './common';
import { type IActionDB, type IPurposeDB, type IStructureDB, type IFillerDB, type ISizeDB } from './explosive-object';
import { type IExplosiveObjectDBv1, type IExplosiveObjectDB } from './explosive-object/explosive-object';
import {
    type EMPLOYEE_TYPE,
    type DOCUMENT_TYPE,
    type EXPLOSIVE_OBJECT_CATEGORY,
    type TRANSPORT_TYPE,
    type EQUIPMENT_TYPE,
    type ROLES,
    type MIME_TYPE,
    type ASSET_TYPE,
    type MISSION_REQUEST_TYPE,
    type EXPLOSIVE_DEVICE_TYPE,
    type RANKS,
    type EXPLOSIVE_OBJECT_STATUS,
    type BOOK_TYPE,
    type MATERIAL,
} from '../enum';

export interface IAddressDB {
    city: string | null;
    country: string | null;
    district: string | null;
    housenumber: string | null;
    postcode: string | null;
    state: string | null;
    street: string | null;
    municipality: string | null;
}

/**
 * saved locally
 */
export interface IRankDB {
    id: string;
    fullName: string;
    shortName: string;
    rank: RANKS;
}

export interface IEmployeeDB extends IBaseDB {
    type: EMPLOYEE_TYPE;
    firstName: string;
    lastName: string;
    surname: string;
    rankId: string;
    position: string;
    authorId: string;
}

export interface IEmployeeActionDB extends IEmployeeDB, ILinkedToDocumentDB {
    employeeId: string;
    typeInDocument: EMPLOYEE_TYPE;
}

export interface IOrderDB extends IBaseDB {
    signedAt: Timestamp;
    number: number;
    authorId: string;
}

export interface IMissionRequestDB extends IBaseDB {
    signedAt: Timestamp;
    number: string;
    authorId: string;
    type?: MISSION_REQUEST_TYPE;
}

export interface IExplosiveObjectActionDBv1 extends IExplosiveObjectDBv1, ILinkedToDocumentDB {
    explosiveObjectId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
    executedAt: Timestamp;
}

export interface IExplosiveObjectActionDB extends IExplosiveObjectDB, ILinkedToDocumentDB {
    explosiveObjectId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
    executedAt: Timestamp;
}

export interface ITransportDB extends IBaseDB {
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
    authorId: string;
}

export interface ITransportActionDB extends ITransportDB, ILinkedToDocumentDB {
    transportId: string;
}

export interface IEquipmentDB extends IBaseDB {
    name: string;
    type: EQUIPMENT_TYPE;
    authorId: string;
}

export interface IEquipmentActionDB extends IEquipmentDB, ILinkedToDocumentDB {
    equipmentId: string;
}

export interface IMissionReportDB extends IBaseDB {
    approvedAt: Timestamp;
    number: number;
    subNumber: number | null;
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number | null;
    uncheckedTerritory: number | null;
    uncheckedReason: string | null;
    workStart: Timestamp;
    exclusionStart: Timestamp | null;
    transportingStart: Timestamp | null;
    destroyedStart: Timestamp | null;
    workEnd: Timestamp;
    address: string;
    addressDetails?: IAddressDB;
    authorId: string;
}

export interface IUserDB extends Omit<IBaseDB, 'organizationId'> {
    email: string;
    roles: ROLES[];
    organizationId: string | null;
}

export interface IOrganizationDB extends IBaseDB {
    name: string;
    membersIds: string[];
    authorId: string;
}

export interface IDocumentDB extends IBaseDB {
    name: string;
    type: ASSET_TYPE;
    documentType: DOCUMENT_TYPE;
    mime: MIME_TYPE;
    authorId: string;
}

export interface IExplosiveDeviceDB extends IBaseDB {
    status?: EXPLOSIVE_OBJECT_STATUS;
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
    purpose?: IPurposeDB | null; // призначення;
    structure?: IStructureDB | null; // будова;
    action?: IActionDB | null; // принцип дії;
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

export interface IExplosiveCompositionDB {
    explosiveId: string | null;
    name: string | null;
    percent: number | null;
    description: string | null;
}

export interface IRangeDB {
    min: number | null;
    max: number | null;
}

export interface IExplosiveDB extends IBaseDB {
    status?: EXPLOSIVE_OBJECT_STATUS;
    name: string;
    imageUri: string | null;
    imageUris: string[] | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    additional: IFieldDB[] | null; // додатково
    composition: IExplosiveCompositionDB[] | null;
    /** @deprecated */
    explosive?: {
        velocity: number | null; // m/s
        brisantness: number | null; // m
        explosiveness: number | null; // m³
        tnt: number | null; // TNT equivalent
    } | null;
    sensitivity?: {
        shock: string | null;
        temperature: string | null;
        friction: string | null;
    } | null;
    /** @deprecated */
    physical?: {
        density: number | null; // kg/m³
        meltingPoint: number | null; // °C
        ignitionPoint: number | null; // °C
    } | null;
    explosiveV2: {
        velocity: IRangeDB | null; // m/s
        brisantness: IRangeDB | null; // m
        explosiveness: IRangeDB | null; // m³
        tnt: IRangeDB | null; // TNT equivalent
    } | null;
    physicalV2: {
        density: IRangeDB | null; // kg/m³
        meltingPoint: IRangeDB | null; // °C
        ignitionPoint: IRangeDB | null; // °C
    } | null;
    authorId: string;
}

export interface IExplosiveDeviceTypeNotDB {
    id: EXPLOSIVE_DEVICE_TYPE;
    name: string;
}

export interface IBookTypeNotDB {
    id: BOOK_TYPE;
    name: string;
}

export interface IBookDB extends IBaseDB {
    status: EXPLOSIVE_OBJECT_STATUS;
    name: string;
    type?: BOOK_TYPE;
    typeV2: BOOK_TYPE[];
    mime: MIME_TYPE;
    imageUri: string;
    size: number;
    uri: string;
}
