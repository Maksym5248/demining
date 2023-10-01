import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaEmployee = {
    name: TABLES.EMPLOYEE,
    columns: {
        id: {
            primaryKey: true,
            unique: true
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
        rank: {
            notNull: true,
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