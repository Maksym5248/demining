import {Overwrite } from '~/types';

import {IEmployeeDB } from './employee';

export const createEmployee = (employee: Overwrite<IEmployeeDB, { id?:string, createdAt?: Date, updatedAt?: Date }>): IEmployeeDB => ({
  id: employee.id,
  firstName: String(employee.firstName) || '',
  lastName: String(employee.lastName) || '',
  surname: String(employee.lastName) || '',
  rank: employee.rank || "",
  position: employee.position || '',
  createdAt: employee?.createdAt,
  updatedAt: employee?.updatedAt,
});
