import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

import { schemaEquipment } from './equipment';

export const schemaEquipmentAction = {
	name: TABLES.EQUIPMENT_ACTION,
	columns: {
		...schemaEquipment.columns,
		equipmentId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		documentType: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		documentId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
	}
};