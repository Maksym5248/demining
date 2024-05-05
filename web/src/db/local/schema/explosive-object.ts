import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

export const schemaExplosiveObject = {
	name: TABLES.EXPLOSIVE_OBJECT,
	columns: {
		id: {
			unique: true,
			primaryKey: true,
		},
		typeId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		name: {
			dataType: DATA_TYPE.String
		},
		caliber: {
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