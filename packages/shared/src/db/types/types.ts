import { type ILinkedToDocumentDB, type IBaseDB, type Timestamp } from './common';
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
    type EXPLOSIVE_TYPE,
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

export interface IExplosiveObjectDB extends IBaseDB {
    typeId: string;
    name: string | null;
    caliber: number | null;
    authorId: string;
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

export interface IPointDB {
    lat: number;
    lng: number;
}

export interface IGeoPointDB extends IPointDB {
    lat: number;
    lng: number;
    hash: string;
}

export interface IGeoBoxDB {
    topLeft: IGeoPointDB;
    bottomRight: IGeoPointDB;
}

export interface IGeoBoxHashDB {
    topLeft: string;
    bottomRight: string;
}

export interface IGeoDB {
    center: IGeoPointDB;
    box: IGeoBoxDB | null;
}

export type IMarkerDB = IPointDB;

export interface ICircleDB {
    center: IPointDB;
    radius: number;
}

export interface ILineDB {
    points: IPointDB[];
    width: number;
}

export interface IPolygonDB {
    points: IPointDB[];
}

export interface IMapViewActionDB extends ILinkedToDocumentDB, IBaseDB {
    marker: IMarkerDB | null;
    circle: ICircleDB | null;
    line: ILineDB | null;
    polygon: IPolygonDB | null;
    zoom: number;
    geo: IGeoDB | null;
    authorId: string;
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

export interface IUserDB extends IBaseDB {
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

export interface IExplosiveDB extends IBaseDB {
    name: string;
    type: EXPLOSIVE_TYPE;
    authorId: string;
}

export interface IExplosiveActionDB extends IExplosiveDB, ILinkedToDocumentDB {
    explosiveId: string;
    weight: number | null /* in kilograms */;
    quantity: number | null;
    executedAt: Timestamp;
}
