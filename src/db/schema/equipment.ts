import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

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
            default: "MINE_DETECTOR",
        },
        name: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
    }
};