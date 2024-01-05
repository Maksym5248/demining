import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

import { schemaEquipment } from './equipment';

export const schemaEquipmentHistory = {
	name: TABLES.EQUIPMENT_HISTORY,
	columns: {
		...schemaEquipment.columns,
		equipmentId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		missionReportId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
	}
};