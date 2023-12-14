import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { ITransport, ITransportValue, Transport, createTransport, createTransportDTO } from './entities';

const Store = types
  .model('TransportStore', {
    collection: createCollection<ITransport, ITransportValue>("Transports", Transport),
    list: createList<ITransport>("TransportsList", safeReference(Transport), { pageSize: 20 }),
  });

const add = asyncAction<Instance<typeof Store>>((data: CreateValue<ITransportValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await Api.transport.add(createTransportDTO(data));
      const value = createTransport(res);

      self.collection.set(res.id, value);
      self.list.unshift(res.id);
      flow.success();
      message.success('Додано успішно');
    } catch (err) {
      console.log("e", err);
      message.error('Не вдалось додати');
    }
  };
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      await Api.transport.remove(id);
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

      const list = await Api.transport.getList();

      list.forEach((el) => {
        const item = createTransport(el);

        if(!self.collection.has(item.id)){
          self.collection.set(item.id, item);
          self.list.push(item.id);
        }
      })

      flow.success();
    } catch (err) {
      flow.failed(err);
    }
  };
});

export const TransportStore = Store.props({ add, remove, fetchList })
