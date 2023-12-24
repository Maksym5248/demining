import { Instance } from 'mobx-state-tree';

import { types } from '../../../../types'
import { IExplosiveObjectHistoryValueParams } from './explosive-object-history.schema';
import { ExplosiveObjectType } from '../explosive-object-type';

export type IExplosiveObjectHistory = Instance<typeof ExplosiveObjectHistory>

const Entity = types.model('ExplosiveObjectHistory', {
  id: types.identifier,
  type: types.reference(ExplosiveObjectType),
  name: types.string,
  caliber: types.number,
  createdAt: types.dayjs,
  updatedAt: types.dayjs,
}).actions((self) => ({
  updateFields(data: Partial<IExplosiveObjectHistoryValueParams>) {
      Object.assign(self, data);
  }
}));


export const ExplosiveObjectHistory = Entity;