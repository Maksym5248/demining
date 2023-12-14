import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

import { schemaEmployee } from './employee';

export const schemaEmployeeHistory = {
    name: TABLES.EMPLOYEE_HISTORY,
    columns: {
        ...schemaEmployee.columns,
        documentType: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        documentId: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        isLeader: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        employeeId: {
            notNull: true,
            dataType: DATA_TYPE.String
        }
    }
};