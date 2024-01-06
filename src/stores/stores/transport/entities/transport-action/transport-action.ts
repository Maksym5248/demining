import { Instance } from 'mobx-state-tree';

import { DOCUMENT_TYPE } from '~/constants';

import { types } from '../../../../types'
import { ITransportActionValue} from './transport-action.schema';
import { Transport } from '../transport/transport';

export type ITransportAction = Instance<typeof TransportAction>

const Entity = Transport.named('TransportAction').props({
	documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
	documentId: types.string,
	equipmentId: types.string,
}).actions((self) => ({
	updateFields(data: Partial<ITransportActionValue>) {
		Object.assign(self, data);
	}
}));


export const TransportAction = Entity;