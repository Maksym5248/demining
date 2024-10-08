import { DATA_TYPE } from 'jsstore';
import { TABLES } from 'shared-my';

export const schemaMissionRequest = {
    name: TABLES.MISSION_REQUEST,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        signedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        number: {
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
