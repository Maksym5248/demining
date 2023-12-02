import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaExplosiveObjectHistory = {
    name: TABLES.EXPLOSIVE_OBJECT_HISTORY,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        typeId: {
            unique: true,
            notNull: true,
            dataType: DATA_TYPE.String
        },
        /**
         * EXPLOSIVE_OBJECT_STATUS
         */
        status: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        /**
         * EXPLOSIVE_OBJECT_CATEGORY
         */
        category: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        description: {
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