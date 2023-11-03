import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { DB } from '~/db'
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

    employeesCollection: createCollection<IEmployee, IEmployeeValue>("Employees", Employee),
    employeesList: createList<IEmployee>("EmployeesList", safeReference(Employee), { pageSize: 20 })
  })
  .actions((self) => ({
    init() {
      ranksData.forEach(data => {
        self.ranksCollection.set(data.id, createRank(data))
        self.ranksList.push(data.id);
      })
    },
  })).views((self) => ({
    get employeesListChief(){
      return self.employeesList.asArray.filter((el) => el.type === EMPLOYEE_TYPE.CHIEF)
    }
  }));

const addEmployee = asyncAction<Instance<typeof Store>>((data: CreateValue<IEmployeeValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      const res = await DB.employee.add(createEmployeeDB(data));
      const employee = createEmployee(res);

      self.employeesCollection.set(employee.id, employee);
      self.employeesList.push(employee.id);
      flow.success();
      message.success('Додано успішно');
    } catch (err) {
      message.error('Не вдалось додати');
    }
  };
});

const removeEmployee = asyncAction<Instance<typeof Store>>((id:string) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();
      await DB.employee.remove(id);
      self.employeesList.removeById(id);
      self.employeesCollection.remove(id);
      flow.success();
      message.success('Видалено успішно');
    } catch (err) {
      message.error('Не вдалось видалити');
    }
  };
});

const fetchEmployees = asyncAction<Instance<typeof Store>>(() => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await DB.employee.getList();

      res.forEach((el) => {
        const employee = createEmployee(el);

        if(!self.employeesCollection.has(employee.id)){
          self.employeesCollection.set(employee.id, employee);
          self.employeesList.push(employee.id);
        }
      })

      flow.success();
    } catch (err) {
      flow.failed(err);
    }
  };
});

export const EmployeeStore = Store.props({ addEmployee, removeEmployee, fetchEmployees })
