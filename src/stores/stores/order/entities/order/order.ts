import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { UpdateValue } from '~/types'
import { DB } from '~/db'

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { Employee } from '../../../employee';
import { IOrderValue, createOrder, updateOrderDB } from './order.schema';

export type IOrder = Instance<typeof Order>

const Entity = types.model('Order', {
  id: types.identifier,
  signedAt: types.dayjs,
  signedBy: Employee.named("EmployeeOrder"),
  number: types.number,
  createdAt: types.dayjs,
  updatedAt: types.dayjs,
}).actions((self) => ({
  updateFields(data: Partial<IOrderValue>) {
      Object.assign(self, data);
  }
}));


const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IOrderValue>) => {
  return async function addFlow({ flow, self }) {
    try {
      flow.start();

      const res = await DB.order.update(self.id, updateOrderDB(data));    

      self.updateFields(createOrder(res));

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

export const Order = Entity.props({ update });