import { EMPLOYEE_TYPE } from "~/constants";

import { createEmployeeType } from './entities';

export const employeeTypesData = [
    createEmployeeType({
        type: EMPLOYEE_TYPE.WORKER,
        name: 'Підлеглий',
    }),
    createEmployeeType({
        type: EMPLOYEE_TYPE.SQUAD_LEAD,
        name: 'Керівник розрахунку на виїзд',
    }),
    createEmployeeType({
        type: EMPLOYEE_TYPE.CHIEF,
        name: 'Керівник підрозділу',
    }),
]