import { Timestamp } from "firebase/firestore";

import { EMPLOYEE_TYPE, DOCUMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY, TRANSPORT_TYPE, EQUIPMENT_TYPE, ROLES } from "~/constants"
import { ICircle, ILatLng } from "~/types";

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
}


export interface IOrderDB {
    id: string;
    signedAt: Timestamp;
    signedByActionId: string;
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

export interface IExplosiveObjectTypeDB {
    id: string;
    name: string;
    fullName: string;
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
    marker?: ILatLng;
    circle?: ICircle;
    zoom: number;
}

export interface IMapViewActionActionDB extends ILinkedToDocumentDB {
    id: string;
    markerLat: number;
    markerLng: number;
    circleCenterLat: number;
    circleCenterLng: number;
    circleRadius: number;
    zoom: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IMissionReportDB {
    id: string;
    approvedByActionId: string;
    approvedAt: Timestamp;
    number: number;
    subNumber: number | undefined,
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    mapViewId: string;
    workStart: Timestamp;
    exclusionStart: Timestamp | undefined;
    transportingStart: Timestamp | undefined;
    destroyedStart: Timestamp | undefined;
    workEnd: Timestamp;
    transportActionIds: string[];
    equipmentActionIds: string[];
    explosiveObjectActionIds: string[];
    squadLeaderActionId: string;
    squadActionIds: string[];
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
