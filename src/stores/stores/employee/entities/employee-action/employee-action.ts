import { Instance } from 'mobx-state-tree';

import { DOCUMENT_TYPE } from "~/constants";

import { types } from '../../../../types'
import { Employee } from "../employee";

export type IEmployeeAction = Instance<typeof EmployeeAction>

const Entity = Employee.named("EmployeeAction").props({
	documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
	documentId: types.string,
	employeeId: types.string,
});

export const EmployeeAction = Entity;