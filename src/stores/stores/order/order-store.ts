import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { DB, IOrderDB } from '~/db'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IOrder, IOrderValue, Order, createOrder, createOrderDB } from './entities';

const Store = types
  .model('OrderStore', {
    collection: createCollection<IOrder, IOrderValue>("Orders", Order),
    list: createList<IOrder>("OrdersList", safeReference(Order), { pageSize: 20 }),
  }).actions((self) => ({
    push: (values: IOrderDB[]) => {
      values.forEach((el) => {
        const order = createOrder(el);

        if(!self.collection.has(order.id)){
          self.collection.set(order.id, order);
          self.list.push(order.id);
        }
      })
    }
  }));

const add = asyncAction<Instance<typeof Store>>((data: CreateValue<IOrderValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await DB.order.add(createOrderDB(data));

      const order = createOrder(res);

      self.collection.set(res.id, order);
      self.list.unshift(res.id);

      flow.success();
      message.success('Додано успішно');
    } catch (err) {
      message.error('Не вдалось додати');
    }
  };
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      await DB.order.remove(id);
      self.list.removeById(id);
      self.collection.remove(id);
      flow.success();
      message.success('Видалено успішно');
    } catch (err) {
      message.error('Не вдалось видалити');
    }
  };
});

const fetchList = asyncAction<Instance<typeof Store>>(() => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      const res = await DB.order.select({
        order: {
          by: "number",
          type: "desc",
        },
      });

      self.push(res);

      flow.success();
    } catch (err) {
      flow.failed(err);
    }
  };
});

export const OrderStore = Store.props({ add, remove, fetchList })
