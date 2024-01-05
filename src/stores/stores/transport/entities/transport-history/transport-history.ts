import { Instance } from 'mobx-state-tree';

import { types } from '../../../../types'
import { ITransportHistoryValue} from './transport-history.schema';
import { Transport } from '../transport/transport';

export type ITransportHistory = Instance<typeof TransportHistory>

const Entity = Transport.named('TransportHistory').props({
	missionReportId: types.string,
	equipmentId: types.string,
}).actions((self) => ({
	updateFields(data: Partial<ITransportHistoryValue>) {
		Object.assign(self, data);
	}
}));


export const TransportHistory = Entity;