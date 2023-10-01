import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { DB, IEmployeeDB } from '~/db'
import { Overwrite } from '~/types'

import { asyncAction } from '../../../../utils';
import { Rank } from '../rank';



export type IEmployee = Instance<typeof Entity>

const Entity = types.model('Employee', {
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  surname: types.string,
  rank: types.reference(Rank),
  position: types.string,
  createdAt: types.Date,
  updatedAt: types.Date,
}).actions((self) => ({
  updateFields(data: Partial<IEmployeeDB>) {
      Object.assign(self, data);
  }
}));


const update = asyncAction<Instance<typeof Entity>>((data: Overwrite<IEmployeeDB, { id?:string, createdAt?: Date, updatedAt?: Date}>) => {
  return async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await DB.employee.update(self.id, data);    
      console.log('res', res);
      self.updateFields(res);

      message.success({
        type: 'success',
        content: 'Збережено успішно',
      });
      flow.success();
    } catch (err) {
      flow.failed(err)
      message.error('Не вдалось додати');
    }
  };
});

export const Employee = Entity.props({ update });