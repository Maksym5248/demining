import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaEmployee = {
    name: TABLES.EMPLOYEE,
    columns: {
        id: {
            primaryKey: true,
            unique: true
        },
        /**
         * EMPLOYEE_TYPE
         */
        type: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        firstName: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        lastName: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        surname: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        rankId: {
            notNull: true,
            require: true,
            dataType: DATA_TYPE.String,
        },
        position: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        createdAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        updatedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        }
    }
};