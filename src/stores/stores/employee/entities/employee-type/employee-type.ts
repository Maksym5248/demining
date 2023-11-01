import { types, Instance } from 'mobx-state-tree';

import {  EMPLOYEE_TYPE } from '~/constants';

export interface IEmployeeTypeValue {
  type: EMPLOYEE_TYPE,
  name: string,
}

export type IEmployeeType = Instance<typeof EmployeeType>

export const EmployeeType = types.model('IEmployeeType', {
  type: types.enumeration(Object.values(EMPLOYEE_TYPE)),
  name: types.string,
});
