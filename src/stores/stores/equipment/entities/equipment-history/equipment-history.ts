import { Instance } from 'mobx-state-tree';

import { types } from '../../../../types'
import { IEquipmentHistoryValue } from './equipment-history.schema';
import { Equipment } from "../equipment";

export type IEquipmentHistory = Instance<typeof EquipmentHistory>

const Entity = Equipment.named('EquipmentHistory').props({
	missionReportId: types.string,
	equipmentId: types.string,
}).actions((self) => ({
	updateFields(data: Partial<IEquipmentHistoryValue>) {
		Object.assign(self, data);
	}
}));


export const EquipmentHistory = Entity;