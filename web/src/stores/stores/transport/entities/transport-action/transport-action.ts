import { Instance } from 'mobx-state-tree';

import { DOCUMENT_TYPE } from '~/constants';

import { ITransportActionValue } from './transport-action.schema';
import { types } from '../../../../types';
import { Transport } from '../transport/transport';

export type ITransportAction = Instance<typeof TransportAction>;

const Entity = Transport.named('TransportAction')
    .props({
        documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
        documentId: types.string,
        transportId: types.string,
    })
    .actions((self) => ({
        updateFields(data: Partial<ITransportActionValue>) {
            Object.assign(self, data);
        },
    }));

export const TransportAction = Entity;
