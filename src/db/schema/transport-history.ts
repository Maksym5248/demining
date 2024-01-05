import { DATA_TYPE } from 'jsstore';

import { TABLES } from '~/constants';

import { schemaTransport } from './transport';

export const schemaTransportHistory = {
	name: TABLES.TRANSPORT_HISTORY,
	columns: {
		...schemaTransport.columns,
		transportId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
		missionReportId: {
			notNull: true,
			dataType: DATA_TYPE.String
		},
	}
};