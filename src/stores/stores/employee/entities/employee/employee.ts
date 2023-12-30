import { Instance } from 'mobx-state-tree';
import { message } from 'antd';
import { upperCase, upperFirst } from 'lodash';

import { Api } from '~/api'
import { UpdateValue } from '~/types'
import { EMPLOYEE_TYPE } from '~/constants';

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { Rank } from '../rank';
import { createEmployee, updateEmployeeDTO, IEmployeeValue } from './employee.schema';

export type IEmployee = Instance<typeof Employee>

const Entity = types.model('Employee', {
  id: types.identifier,
  type: types.enumeration(Object.values(EMPLOYEE_TYPE)),
  firstName: types.string,
  lastName: types.string,
  surname: types.string,
  rank: types.reference(Rank),
  position: types.string,
  createdAt: types.dayjs,
  updatedAt: types.dayjs,
}).actions((self) => ({
  updateFields(data: Partial<IEmployeeValue>) {
      Object.assign(self, data);
  }
})).views((self) => ({
  get fullName(){
    return `${self.rank.shortName} ${upperFirst(self.lastName)} ${upperCase(self.firstName[0])}. ${upperCase(self.surname[0])}.`
  }
}));


const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IEmployeeValue>) => async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await Api.employee.update(self.id, updateEmployeeDTO(data));    

      self.updateFields(createEmployee(res));

      message.success({
        type: 'success',
        content: 'Збережено успішно',
      });
      flow.success();
    } catch (err) {
      flow.failed(err)
      message.error('Не вдалось додати');
    }
  });

export const Employee = Entity.props({ update });