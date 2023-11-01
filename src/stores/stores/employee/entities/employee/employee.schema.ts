import {Overwrite } from '~/types';
import {IEmployeeDB } from '~/db';
import { EMPLOYEE_TYPE } from '~/constants';

export const createEmployee = (employee: Overwrite<IEmployeeDB, { id?:string, createdAt?: Date, updatedAt?: Date }>): IEmployeeDB => ({
  id: employee.id,
  type: employee.type || EMPLOYEE_TYPE.WORKER,
  firstName: String(employee.firstName) || '',
  lastName: String(employee.lastName) || '',
  surname: String(employee.lastName) || '',
  rank: employee.rank || "",
  position: employee.position || '',
  createdAt: employee?.createdAt,
  updatedAt: employee?.updatedAt,
});
