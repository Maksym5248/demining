import { DOCUMENT_TYPE } from "~/constants"
import { IEmployeeHistoryDTO } from '~/api';

import { IEmployeeValue, createEmployee } from '../employee';


export interface IEmployeeHistoryValue extends IEmployeeValue {
  documentType: DOCUMENT_TYPE;
  documentId: string;
  employeeId: string;
}

export const createEmployeeHistory = (employee: IEmployeeHistoryDTO): IEmployeeHistoryValue => ({
	...createEmployee(employee),
	documentType: employee.documentType,
	documentId: employee.documentId,
	employeeId: employee.employeeId,
});


