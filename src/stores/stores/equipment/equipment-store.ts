import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IEquipment, IEquipmentValue, Equipment, createEquipment, createEquipmentDTO } from './entities';

const Store = types
  .model('EquipmentStore', {
    collection: createCollection<IEquipment, IEquipmentValue>("Equipments", Equipment),
    list: createList<IEquipment>("EquipmentsList", safeReference(Equipment), { pageSize: 20 }),
  });

const add = asyncAction<Instance<typeof Store>>((data: CreateValue<IEquipmentValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await Api.equipment.add(createEquipmentDTO(data));
      const value = createEquipment(res);

      self.collection.set(res.id, value);
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
      await Api.equipment.remove(id);
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
    if(flow.isLoaded){
      return
    }
    
    try {
      flow.start();

      const list = await Api.equipment.getList();

      list.forEach((el) => {
        const item = createEquipment(el);

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

export const EquipmentStore = Store.props({ add, remove, fetchList })
