import { EMPLOYEE_TYPE, DOCUMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY, TRANSPORT_TYPE, EQUIPMENT_TYPE } from "~/constants"
import { ICircle, ILatLng } from "~/types";



export interface IEmployeeDB {
    id: string;
    type: EMPLOYEE_TYPE;
    firstName: string;
    lastName: string;
    surname: string;
    rankId: string;
    position: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEmployeeActionDB extends IEmployeeDB {
    documentType: DOCUMENT_TYPE;
    documentId: string;
    employeeId: string;
}


export interface IOrderDB {
    id: string;
    signedAt: Date;
    signedByActionId: string;
    number: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMissionRequestDB {
    id: string;
    signedAt: Date;
    number: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExplosiveObjectTypeDB {
    id: string;
    name: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExplosiveObjectDB {
    id: string;
    typeId: string;
    name?: string;
    caliber?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExplosiveObjectActionDB extends IExplosiveObjectDB {
    explosiveObjectId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransportDB {
    id: string;
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransportActionDB extends ITransportDB {
    transportId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export interface IEquipmentDB {
    id: string;
    name: string;
    type: EQUIPMENT_TYPE;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEquipmentActionDB extends IEquipmentDB {
    equipmentId: string;
    documentType: DOCUMENT_TYPE;
    documentId: string;
}

export interface IMapView {
    marker?: ILatLng;
    circle?: ICircle;
    zoom: number;
}

export interface IMapViewDB {
    id: string;
    documentId: string;
    documentType: string;
    markerLat: number;
    markerLng: number;
    circleCenterLat: number;
    circleCenterLng: number;
    circleRadius: number;
    zoom: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMissionReportDB {
    id: string;
    approvedByActionId: string;
    approvedAt: Date;
    number: number;
    subNumber: number | undefined,
    executedAt: Date;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    mapViewId: string;
    workStart: Date;
    exclusionStart: Date;
    transportingStart: Date;
    destroyedStart: Date;
    workEnd: Date;
    transportActionIds: string[];
    equipmentActionIds: string[];
    explosiveObjectActionIds: string[];
    squadLeaderActionId: string;
    squadActionIds: string[];
    address: string;
}
