import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaExplosiveObjectType = {
    name: TABLES.EXPLOSIVE_OBJECT_TYPE,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        name: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        fullName: {
            notNull: true,
            dataType: DATA_TYPE.String
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