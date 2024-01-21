import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaMapView = {
	name: TABLES.MAP_VIEW,
	columns: {
		id: {
			unique: true,
			primaryKey: true,
		},
		documentId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		documentType: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		markerLat: {
			notNull: true,
			dataType: DATA_TYPE.Number
		},
		markerLng: {
			notNull: true,
			dataType: DATA_TYPE.Number
		},
		circleCenterLat: {
			dataType: DATA_TYPE.Number
		},
		circleCenterLng: {
			dataType: DATA_TYPE.Number
		},
		circleRadius: {
			dataType: DATA_TYPE.Number
		},
		zoom: {
			dataType: DATA_TYPE.Number
		},
		createdAt: {
			notNull: true,
			dataType: DATA_TYPE.DateTime,
		},
		updatedAt: {
			notNull: true,
			dataType: DATA_TYPE.DateTime,
		}
	}
};