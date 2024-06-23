import { type DOCUMENT_TYPE } from 'shared-my/db';

import { type IEmployeeActionDTO } from '~/api';

import { type IEmployeeData, createEmployee } from '../employee';

export interface IEmployeeActionData extends IEmployeeData {
    executedAt?: Date;
    documentType: DOCUMENT_TYPE;
    documentId: string;
    employeeId: string;
}

export const createEmployeeAction = (value: IEmployeeActionDTO): IEmployeeActionData => ({
    ...createEmployee(value),
    documentType: value.documentType,
    documentId: value.documentId,
    employeeId: value.employeeId,
});
