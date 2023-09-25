import { types, Instance } from 'mobx-state-tree';


export type IEmployee = Instance<typeof Employee>

export const Employee = types.model('Employee', {
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  surname: types.string,
  rank: types.string,
  position: types.string,
});
