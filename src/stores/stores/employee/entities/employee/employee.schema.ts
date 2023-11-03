import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import {IEmployeeDB } from '~/db';
import { EMPLOYEE_TYPE } from '~/constants';
import { dates, data } from '~/utils';


export interface IEmployeeValue {
  id: string;
  type: EMPLOYEE_TYPE;
  firstName: string;
  lastName: string;
  surname: string;
  rank: string;
  position: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export const createEmployeeDB = (employee: Partial<IEmployeeValue>): CreateValue<IEmployeeDB>  => ({
  type: employee.type || null,
  firstName: String(employee.firstName) || null,
  lastName: String(employee.lastName) || null,
  surname: String(employee.surname) || null,
  rankId: employee.rank || null,
  position: employee.position || null,
});

export const updateEmployeeDB = data.createUpdateOrderDB<IEmployeeValue, IEmployeeDB>(createEmployeeDB);


export const createEmployee = (employee: IEmployeeDB): IEmployeeValue => ({
  id: employee.id,
  type: employee.type || EMPLOYEE_TYPE.WORKER,
  firstName: String(employee.firstName) || '',
  lastName: String(employee.lastName) || '',
  surname: String(employee.lastName) || '',
  rank: employee.rankId,
  position: employee.position || '',
  createdAt: dates.create(employee.createdAt),
  updatedAt: dates.create(employee.updatedAt),
});


