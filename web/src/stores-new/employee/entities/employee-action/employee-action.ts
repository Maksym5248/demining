import { makeAutoObservable } from 'mobx';

import { DOCUMENT_TYPE } from '~/constants';

import { EmployeeActionValue, IEmployeeActionValue } from './employee-action.schema';
import { Employee, IEmployeeParams, IEmployee } from '../employee';

export interface IEmployeeAction extends IEmployee, IEmployeeActionValue {}

export class EmployeeAction extends Employee implements IEmployeeAction {
    documentType: DOCUMENT_TYPE;
    documentId: string;
    employeeId: string;

    constructor(data: IEmployeeActionValue, params: IEmployeeParams) {
        const employeeAction = new EmployeeActionValue(data);

        super(employeeAction, params);
        this.documentType = employeeAction.documentType;
        this.documentId = employeeAction.documentId;
        this.employeeId = employeeAction.employeeId;

        makeAutoObservable(this);
    }
}
