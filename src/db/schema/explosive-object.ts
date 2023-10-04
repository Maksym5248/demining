import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaExplosiveObject = {
    name: TABLES.EXPLOSIVE_OBJECT,
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
    }
};