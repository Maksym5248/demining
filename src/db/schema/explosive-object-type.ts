import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaExplosiveObjectType = {
    name: TABLES.EXPLOSIVE_OBJECT_TYPE,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        type: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        name: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        caliber: {
            dataType: DATA_TYPE.Number
        },
    }
};