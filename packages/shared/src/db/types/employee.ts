import { type IBaseDB, type ILinkedToDocumentDB } from './common';
import { type EMPLOYEE_TYPE, type RANKS } from '../enum';

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
