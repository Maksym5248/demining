import { TABLES } from '~/constants';

import { schemaEquipment } from './equipment';

export const schemaEquipmentHistory = {
	name: TABLES.EQUIPMENT_HISTORY,
	columns: {
		...schemaEquipment.columns,
	}
};