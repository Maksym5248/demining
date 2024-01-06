import { DOCUMENT_TYPE } from "~/constants"
import { IEmployeeActionDTO } from '~/api';

import { IEmployeeValue, createEmployee } from '../employee';


export interface IEmployeeActionValue extends IEmployeeValue {
  documentType: DOCUMENT_TYPE;
  documentId: string;
  employeeId: string;
}

export const createEmployeeAction = (employee: IEmployeeActionDTO): IEmployeeActionValue => ({
	...createEmployee(employee),
	documentType: employee.documentType,
	documentId: employee.documentId,
	employeeId: employee.employeeId,
});


