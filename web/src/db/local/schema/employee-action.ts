import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

import { schemaEmployee } from './employee';

export const schemaEmployeeAction = {
    name: TABLES.EMPLOYEE_ACTION,
    columns: {
        ...schemaEmployee.columns,
        documentType: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        documentId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        employeeId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
    },
};
