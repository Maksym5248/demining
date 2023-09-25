import { types } from 'mobx-state-tree';

import { Rank, Employee } from './entities';
import { createCollection, createList } from '../../utils';
import { ranksData } from './ranks-data'

const Store = types
  .model('EmployeeStore', {
    ranksCollection: createCollection("Ranks", Rank),
    employeesCollection: createCollection("Employees", Employee),
    employeesList: createList("EmployeesList", Rank, { pageSize: 20 })
  })
  .actions((self) => ({
    init() {
      ranksData.forEach(data => self.ranksCollection.set(data.id, data))
    },
  }));

export const EmployeeStore = Store
