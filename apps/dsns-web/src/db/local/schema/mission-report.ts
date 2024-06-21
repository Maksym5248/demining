import { DATA_TYPE } from 'jsstore';
import { TABLES } from 'shared-my/db';

export const schemaMissionReport = {
    name: TABLES.MISSION_REPORT,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        approvedByActionId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        approvedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        number: {
            notNull: true,
            dataType: DATA_TYPE.Number,
        },
        subNumber: {
            dataType: DATA_TYPE.Number,
        },
        executedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        orderId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        missionRequestId: {
            notNull: true,
            dataType: DATA_TYPE.String,
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
            dataType: DATA_TYPE.Number,
        },
        uncheckedTerritory: {
            dataType: DATA_TYPE.Number,
        },
        uncheckedReason: {
            dataType: DATA_TYPE.String,
        },
        mapViewId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        address: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        workStart: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        exclusionStart: {
            dataType: DATA_TYPE.DateTime,
        },
        transportingStart: {
            dataType: DATA_TYPE.DateTime,
        },
        destroyedStart: {
            dataType: DATA_TYPE.DateTime,
        },
        workEnd: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        transportActionIds: {
            notNull: true,
            dataType: DATA_TYPE.Array,
        },
        equipmentActionIds: {
            notNull: true,
            dataType: DATA_TYPE.Array,
        },
        explosiveObjectActionIds: {
            notNull: true,
            dataType: DATA_TYPE.Array,
        },
        squadLeaderActionId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        squadActionIds: {
            notNull: true,
            dataType: DATA_TYPE.Array,
        },
    },
};
