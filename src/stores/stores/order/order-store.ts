import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { DB } from '~/db'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IOrder, IOrderValue, Order, createOrder, createOrderDB } from './entities';

const Store = types
  .model('EmployeeStore', {
    orderCollection: createCollection<IOrder, IOrderValue>("Orders", Order),
    orderList: createList<IOrder>("OrdersList", safeReference(Order), { pageSize: 20 }),
  });

const addOrder = asyncAction<Instance<typeof Store>>((data: CreateValue<IOrderValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await DB.order.add(createOrderDB(data));
      const order = createOrder(res);

      self.orderCollection.set(res.id, order);
      self.orderList.unshift(res.id);
      flow.success();
      message.success('Додано успішно');
    } catch (err) {
      message.error('Не вдалось додати');
    }
  };
});

const removeOrder = asyncAction<Instance<typeof Store>>((id:string) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      await DB.order.remove(id);
      self.orderList.removeById(id);
      self.orderCollection.remove(id);
      flow.success();
      message.success('Видалено успішно');
    } catch (err) {
      message.error('Не вдалось видалити');
    }
  };
});

const fetchOrders = asyncAction<Instance<typeof Store>>(() => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      const res = await DB.order.getList({
        order: {
          by: "number",
          type: "desc",
        }
      });

      res.forEach((el) => {
        const order = createOrder(el);

        if(!self.orderCollection.has(order.id)){
          self.orderCollection.set(order.id, order);
          self.orderList.push(order.id);
        }
      })

      flow.success();
    } catch (err) {
      flow.failed(err);
    }
  };
});

export const OrderStore = Store.props({ addOrder, removeOrder, fetchOrders })
