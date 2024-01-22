import { Instance } from 'mobx-state-tree';

import { DOCUMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY } from '~/constants';

import { types } from '../../../../types'
import { IExplosiveObjectActionValue } from './explosive-object-action.schema';
import { ExplosiveObject } from '../explosive-object';

export type IExplosiveObjectAction = Instance<typeof ExplosiveObjectAction>

const Entity =  ExplosiveObject.named("ExplosiveObjectAction").props({
	explosiveObjectId: types.string,
	documentType: types.enumeration(Object.values(DOCUMENT_TYPE)),
	documentId: types.string,
	quantity:  types.number,
	category: types.enumeration(Object.values(EXPLOSIVE_OBJECT_CATEGORY)),
	isDiscovered: types.boolean,
	isTransported: types.boolean,
	isDestroyed: types.boolean,
}).actions((self) => ({
	updateFields(data: Partial<IExplosiveObjectActionValue>) {
		Object.assign(self, data);
	}
}));


export const ExplosiveObjectAction = Entity;