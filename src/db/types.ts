import { Timestamp } from "firebase/firestore";

import { EMPLOYEE_TYPE, DOCUMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY, TRANSPORT_TYPE, EQUIPMENT_TYPE, ROLES, MIME_TYPE, ASSET_TYPE } from "~/constants"
import { ICircle, IPoint } from "~/types";

export interface ILinkedToDocumentDB {
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export interface IEmployeeDB {
    id: string;
    type: EMPLOYEE_TYPE;
    firstName: string;
    lastName: string;
    surname: string;
    rankId: string;
    position: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IEmployeeActionDB extends IEmployeeDB, ILinkedToDocumentDB {
    employeeId: string;
    typeInDocument: EMPLOYEE_TYPE;
}

export interface IOrderDB {
    id: string;
    signedAt: Timestamp;
    number: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IMissionRequestDB {
    id: string;
    signedAt: Timestamp;
    number: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IExplosiveObjectDB {
    id: string;
    typeId: string;
    name?: string;
    caliber?: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IExplosiveObjectActionDB extends IExplosiveObjectDB, ILinkedToDocumentDB {
    explosiveObjectId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface ITransportDB {
    id: string;
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface ITransportActionDB extends ITransportDB, ILinkedToDocumentDB {
    transportId: string;
}

export interface IEquipmentDB {
    id: string;
    name: string;
    type: EQUIPMENT_TYPE;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IEquipmentActionDB extends IEquipmentDB, ILinkedToDocumentDB {
    equipmentId: string;
}

export interface IMapViewAction {
    marker?: IPoint;
    circle?: ICircle;
    zoom: number;
}


export interface IPointDB {
    lat: number;
    lng: number;
}

export interface IMarkerDB extends IPointDB {}

export interface ICircleDB {
    center: IPointDB;
    radius: number;
}

export interface IPolygonDB {
    points: IPointDB[];
}

export interface IMapViewActionActionDB extends ILinkedToDocumentDB {
    id: string;
    marker: IMarkerDB | null;
    circle: ICircleDB | null;
    polygon: IPolygonDB | null;
    zoom: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IMissionReportDB {
    id: string;
    approvedAt: Timestamp;
    number: number;
    subNumber: number | null,
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number |null;
    uncheckedTerritory: number |null;
    uncheckedReason: string | null;
    workStart: Timestamp;
    exclusionStart: Timestamp | null;
    transportingStart: Timestamp | null;
    destroyedStart: Timestamp | null;
    workEnd: Timestamp;
    address: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IUserDB {
    id: string;
    email: string;
    roles: ROLES[];
    organizationId: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IOrganizationDB {
    id: string;
    name: string;
    membersIds: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IDocumentDB {
    id: string;
    name: string;
    type: ASSET_TYPE;
    documentType: DOCUMENT_TYPE;
    mime: MIME_TYPE;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
