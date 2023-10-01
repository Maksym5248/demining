import { types } from 'mobx-state-tree';
import uuid from 'uuid/v4';

import { Overwrite } from '~/types'

import { Rank, IRank, IRankValue, Employee, IEmployee, IEmployeeValue, createEmployee, createRank } from './entities';
import { createCollection, createList, safeReference } from '../../utils';
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

    addEmployee(data: Overwrite<IEmployeeValue, { id?:string, createdAt?: Date, updatedAt?: Date}>) {
      let id = uuid();

      while(self.employeesCollection.get(id)){
        id = uuid();
      }
      
      const employee = createEmployee({...data, id});

      self.employeesCollection.set(id, employee);
      self.employeesList.push(id);
    },
    removeEmployee(id:string) {
      self.employeesList.removeById(id);
      self.employeesCollection.remove(id);
    },
  }));

export const EmployeeStore = Store
