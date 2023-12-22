import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { UpdateValue } from '~/types'
import { Api } from '~/api'

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { IExplosiveObjectValueParams, updateExplosiveObjectDTO, createExplosiveObject } from './explosive-object.schema';
import { ExplosiveObjectType } from '../explosive-object-type';

export type IExplosiveObject = Instance<typeof ExplosiveObject>

const Entity = types.model('ExplosiveObject', {
  id: types.identifier,
  type: types.reference(ExplosiveObjectType),
  name: types.string,
  caliber: types.number,
  createdAt: types.dayjs,
  updatedAt: types.dayjs,
}).actions((self) => ({
  updateFields(data: Partial<IExplosiveObjectValueParams>) {
      Object.assign(self, data);
  }
})).views((self) => ({
  get displayName(){
    return self.caliber ? `Калібр: ${self.caliber}`: self.name
  },
  get fullDisplayName(){
    return `${self.type.name} - ` + (self.caliber ? `Калібр: ${self.caliber}`: self.name)
  }
}));

const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IExplosiveObjectValueParams>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await Api.explosiveObject.update(self.id, updateExplosiveObjectDTO(data));    

      self.updateFields(createExplosiveObject(res));

      message.success({
        type: 'success',
        content: 'Збережено успішно',
      });
      flow.success();
    } catch (err) {
      flow.failed(err)
      message.error('Не вдалось додати');
    }
  };
});

export const ExplosiveObject = Entity.props({ update });