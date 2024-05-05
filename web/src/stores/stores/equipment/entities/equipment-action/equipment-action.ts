import { Instance } from 'mobx-state-tree';

import { DOCUMENT_TYPE } from '~/constants';

import { types } from '../../../../types'
import { IEquipmentActionValue } from './equipment-action.schema';
import { Equipment } from "../equipment";

export type IEquipmentAction = Instance<typeof EquipmentAction>

const Entity = Equipment.named('EquipmentAction').props({
	documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
	documentId: types.string,
	equipmentId: types.string,
}).actions((self) => ({
	updateFields(data: Partial<IEquipmentActionValue>) {
		Object.assign(self, data);
	}
}));


export const EquipmentAction = Entity;