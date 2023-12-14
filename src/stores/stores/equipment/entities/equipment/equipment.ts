import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { UpdateValue } from '~/types'
import { Api } from '~/api'
import { EQUIPMENT_TYPE } from '~/constants'

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { IEquipmentValue, updateEquipmentDTO, createEquipment } from './equipment.schema';

export type IEquipment = Instance<typeof Equipment>

const Entity = types.model('Equipment', {
  id: types.identifier,
  name: types.string,
  type: types.enumeration(Object.values(EQUIPMENT_TYPE)),
  createdAt: types.dayjs,
  updatedAt: types.dayjs,
}).actions((self) => ({
  updateFields(data: Partial<IEquipmentValue>) {
      Object.assign(self, data);
  }
}));


const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IEquipmentValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await Api.equipment.update(self.id, updateEquipmentDTO(data));    

      self.updateFields(createEquipment(res));

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

export const Equipment = Entity.props({ update });