import { Instance } from 'mobx-state-tree';

import { DOCUMENT_TYPE } from "~/constants";

import { types } from '../../../../types'
import { Employee } from "../employee";

export type IEmployeeHistory = Instance<typeof EmployeeHistory>

const Entity = Employee.named("EmployeeHistory").props({
  documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
  documentId: types.string,
  employeeId: types.string,
});

export const EmployeeHistory = Entity;