import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaAddress = {
	name: TABLES.ADDRESS,
	columns: {
		id: {
			unique: true,
			primaryKey: true,
		},
		address: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		lng: {
			notNull: true,
			dataType: DATA_TYPE.Number
		},
		lat: {
			notNull: true,
			dataType: DATA_TYPE.Number,
		},
	}
};