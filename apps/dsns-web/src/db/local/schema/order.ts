import { DATA_TYPE } from 'jsstore';
import { TABLES } from 'shared-my';

export const schemaOrder = {
    name: TABLES.ORDER,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        signedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        /**
         * id of EMPLOYEE_TYPE.CHIEF
         */
        signedByActionId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        number: {
            unique: true,
            notNull: true,
            dataType: DATA_TYPE.Number,
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
