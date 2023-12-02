import { EMPLOYEE_TYPE, DOCUMENT_TYPE } from "~/constants"

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

export interface IEmployeeHistoryDB extends IEmployeeDB {
    documentType: DOCUMENT_TYPE;
    documentId: string;
    employeeId: string;
}


export interface IOrderDB {
    id: string;
    signedAt: Date;
    signedById: string;
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

export interface IExplosiveObjectDB {
    id: string;
    typeId: string;
    name: string;
    caliber?: number;
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