import {Overwrite } from '~/types';

import {IEmployeeValue } from './employee';

export const createEmployee = (employee: Overwrite<IEmployeeValue, { id?:string, createdAt?: Date, updatedAt?: Date }>): IEmployeeValue => ({
  id: employee.id,
  firstName: String(employee.firstName) || '',
  lastName: String(employee.lastName) || '',
  surname: String(employee.lastName) || '',
  rank: employee.rank || "",
  position: employee.position || '',
  createdAt: new Date(),
  updatedAt: new Date(),
});
