import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaMissionReport = {
	name: TABLES.MISSION_REPORT,
	columns: {
		id: {
			unique: true,
			primaryKey: true,
		},
		approvedByHistoryId: {
			notNull: true,
			dataType: DATA_TYPE.String
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
			notNull: true,
			dataType: DATA_TYPE.String
		},
		missionRequestId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		addressId: { // --------
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
			dataType: DATA_TYPE.String
		},
		workStart: {
			dataType: DATA_TYPE.DateTime
		},
		exclusionStart: {
			dataType: DATA_TYPE.DateTime
		},
		transportingStart: {
			dataType: DATA_TYPE.DateTime
		},
		destroyedStart: {
			dataType: DATA_TYPE.DateTime
		},
		workEnd: {
			dataType: DATA_TYPE.DateTime
		},
		transportHistoryIds: {
		    notNull: true,
		    dataType: DATA_TYPE.Array
		},
		equipmentHistoryIds: {
		    notNull: true,
		    dataType: DATA_TYPE.Array
		},
		explosiveObjectHistoryIds: {
		    notNull: true,
		    dataType: DATA_TYPE.Array
		},
		squadLeaderHistoryId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		squadHistoryIds: {
		    notNull: true,
		    dataType: DATA_TYPE.Array
		},
	}
};