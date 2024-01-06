import { Instance } from 'mobx-state-tree';

import { types } from '../../../../types'
import { IExplosiveObjectActionValueParams } from './explosive-object-action.schema';
import { ExplosiveObjectType } from '../explosive-object-type';

export type IExplosiveObjectAction = Instance<typeof ExplosiveObjectAction>

const Entity = types.model('ExplosiveObjectAction', {
	id: types.identifier,
	type: types.reference(ExplosiveObjectType),
	name: types.string,
	caliber: types.number,
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).actions((self) => ({
	updateFields(data: Partial<IExplosiveObjectActionValueParams>) {
		Object.assign(self, data);
	}
}));


export const ExplosiveObjectAction = Entity;