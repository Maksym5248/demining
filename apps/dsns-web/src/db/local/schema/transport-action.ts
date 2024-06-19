import { TABLES } from '@/shared/db';
import { DATA_TYPE } from 'jsstore';

import { schemaTransport } from './transport';

export const schemaTransportAction = {
    name: TABLES.TRANSPORT_ACTION,
    columns: {
        ...schemaTransport.columns,
        transportId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        documentType: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        documentId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
    },
};
