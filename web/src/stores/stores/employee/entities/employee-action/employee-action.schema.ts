import { IEmployeeActionDTO } from '~/api';
import { DOCUMENT_TYPE } from '~/constants';

import { IEmployeeValue, createEmployee } from '../employee';

export interface IEmployeeActionValue extends IEmployeeValue {
    executedAt?: Date;
    documentType: DOCUMENT_TYPE;
    documentId: string;
    employeeId: string;
}

export const createEmployeeAction = (value: IEmployeeActionDTO): IEmployeeActionValue => ({
    ...createEmployee(value),
    documentType: value.documentType,
    documentId: value.documentId,
    employeeId: value.employeeId,
});
