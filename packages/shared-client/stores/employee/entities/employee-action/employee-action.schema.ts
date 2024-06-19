import { type DOCUMENT_TYPE } from '@/shared/db';

import { type IEmployeeActionDTO } from '~/api';

import { EmployeeValue, type IEmployeeValue, createEmployee } from '../employee';

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

export class EmployeeActionValue extends EmployeeValue implements IEmployeeActionValue {
    executedAt?: Date;
    documentType: DOCUMENT_TYPE;
    documentId: string;
    employeeId: string;

    constructor(value: IEmployeeActionValue) {
        super(value);

        this.executedAt = value.executedAt;
        this.documentType = value.documentType;
        this.documentId = value.documentId;
        this.employeeId = value.employeeId;
    }
}
