import { DATA_TYPE } from 'jsstore';
import { TABLES } from 'shared-my';

import { schemaExplosiveObject } from './explosive-object';

export const schemaExplosiveObjectAction = {
    name: TABLES.EXPLOSIVE_OBJECT_ACTION,
    columns: {
        ...schemaExplosiveObject.columns,
        explosiveObjectId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        documentType: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        documentId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },

        quantity: {
            notNull: true,
            dataType: DATA_TYPE.Number,
        },
        /**
         * EXPLOSIVE_OBJECT_CATEGORY
         */
        category: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        isDiscovered: {
            notNull: true,
            dataType: DATA_TYPE.Boolean,
            default: false,
        },
        isTransported: {
            notNull: true,
            dataType: DATA_TYPE.Boolean,
            default: false,
        },
        isDestroyed: {
            notNull: true,
            dataType: DATA_TYPE.Boolean,
            default: false,
        },
    },
};
