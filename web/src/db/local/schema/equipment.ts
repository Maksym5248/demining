import { DATA_TYPE } from 'jsstore';

import { TABLES, EQUIPMENT_TYPE } from '~/constants';

export const schemaEquipment = {
    name: TABLES.EQUIPMENT,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        type: {
            notNull: true,
            dataType: DATA_TYPE.String,
            default: EQUIPMENT_TYPE.MINE_DETECTOR,
        },
        name: {
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
