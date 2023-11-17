import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { DB, IEmployeeDB } from '~/db'
import { EMPLOYEE_TYPE } from '~/constants'
import { CreateValue } from '~/types'

import { types } from '../../types'
import { asyncAction , createCollection, createList, safeReference } from '../../utils';
import { Rank, IRank, IRankValue, Employee, IEmployee, IEmployeeValue, createEmployee, createEmployeeDB,  createRank } from './entities';
import { ranksData } from './ranks-data'

const Store = types
  .model('EmployeeStore', {
    ranksCollection: createCollection<IRank, IRankValue>("Ranks", Rank),
    ranksList: createList<IRank>("RanksList", safeReference(Rank), { pageSize: 20 }),

    collection: createCollection<IEmployee, IEmployeeValue>("Employees", Employee),
    list: createList<IEmployee>("EmployeesList", safeReference(Employee), { pageSize: 20 })
  })
  .actions((self) => ({
    init() {
      ranksData.forEach(data => {
        self.ranksCollection.set(data.id, createRank(data))
        self.ranksList.push(data.id);
      })
    },
    push: (values: IEmployeeDB[]) => {
      values.forEach((el) => {
        const employee = createEmployee(el);

        if(!self.collection.has(employee.id)){
          self.collection.set(employee.id, employee);
          self.list.push(employee.id);
        }
      })
    }
  })).views((self) => ({
    get employeesListChief(){
      return self.list.asArray.filter((el) => el.type === EMPLOYEE_TYPE.CHIEF)
    },

    getById(id:string){
      return self.collection.get(id);
    }
  }));

const add = asyncAction<Instance<typeof Store>>((data: CreateValue<IEmployeeValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      const res = await DB.employee.add(createEmployeeDB(data));
      const employee = createEmployee(res);

      self.collection.set(employee.id, employee);
      self.list.push(employee.id);
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
      await DB.employee.remove(id);
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

      const res = await DB.employee.getList();

      self.push(res);

      flow.success();
    } catch (err) {
      flow.failed(err);
    }
  };
});

export const EmployeeStore = Store.props({ add, remove, fetchList })
