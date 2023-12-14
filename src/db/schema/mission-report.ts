import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaMissionReport = {
    name: TABLES.MISSION_REPORT,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        approvedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime
        },
        number: {
            notNull: true,
            dataType: DATA_TYPE.Number
        },
        subNumber: {
            notNull: true,
            dataType: DATA_TYPE.Number
        },
        executedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime
        },
        orderId: {
            unique: true,
            notNull: true,
            dataType: DATA_TYPE.String
        },
        addressId: {
            unique: true,
            notNull: true,
            dataType: DATA_TYPE.String
        },
        /**
        * measure in m2
        */
        checkedTerritory: {
            dataType: DATA_TYPE.Number,
        },
        /**
        * measure in m
        */
        depthExamination: {
            notNull: true,
            dataType: DATA_TYPE.Number
        },
        uncheckedTerritory: {
            dataType: DATA_TYPE.Number
        },
        uncheckedReason: {
            dataType: DATA_TYPE.Number
        },
        exclusionStart: {
            dataType: DATA_TYPE.DateTime
        },
        exclusionEnd: {
            dataType: DATA_TYPE.DateTime
        },
        transportingStart: {
            dataType: DATA_TYPE.DateTime
        },
        transportingEnd: {
            dataType: DATA_TYPE.DateTime
        },
        destroyedStart: {
            dataType: DATA_TYPE.DateTime
        },
        destroyedEnd: {
            dataType: DATA_TYPE.DateTime
        },
        // transportIds: {
        //     notNull: true,
        //     dataType: DATA_TYPE.Array
        // },
        // equipmentIds: {
        //     notNull: true,
        //     dataType: DATA_TYPE.Array
        // },

        // explosiveObject: { explosive-objects-history
        //     notNull: true,
        //     dataType: DATA_TYPE.Array
        // },
        // squadLeaderId: { employee-history
        //     notNull: true,
        //     dataType: DATA_TYPE.String
        // },
        // squadIds: { employee-history
        //     notNull: true,
        //     dataType: DATA_TYPE.Array
        // },
    }
};