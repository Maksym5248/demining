import { TABLES } from '~/constants';

import { schemaTransport } from './transport';

export const schemaTransportHistory = {
	name: TABLES.TRANSPORT_HISTORY,
	columns: {
		...schemaTransport.columns,
	}
};