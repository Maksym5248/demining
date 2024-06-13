import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaTransport = {
    name: TABLES.TRANSPORT,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        name: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },

        number: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        /**
         * TRANSPORT_TYPE
         */
        type: {
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
        },
    },
};
