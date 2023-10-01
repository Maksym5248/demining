import { types, ReferenceIdentifier, Instance } from 'mobx-state-tree';

import { Rank } from '../rank';

export interface IEmployeeValue {
  id: string,
  firstName: string,
  lastName: string,
  surname: string,
  rank: ReferenceIdentifier,
  position: string,
  createdAt: Date,
  updatedAt: Date,
}

export type IEmployee = Instance<typeof Employee>

export const Employee = types.model('Employee', {
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  surname: types.string,
  rank: types.reference(Rank),
  position: types.string,
  createdAt: types.Date,
  updatedAt: types.Date,
}).actions((self) => ({
  update(data: Partial<IEmployeeValue>) {
      Object.assign(self, {
        ...data,
        updatedAt: new Date()
      });
  },
}));
