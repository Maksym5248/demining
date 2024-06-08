import { message } from 'antd';
import { Instance } from 'mobx-state-tree';

import { Api } from '~/api';
import { EMPLOYEE_TYPE } from '~/constants';
import { UpdateValue } from '~/types';
import { str } from '~/utils';

import { createEmployee, updateEmployeeDTO, IEmployeeValue } from './employee.schema';
import { types } from '../../../../types';
import { asyncAction } from '../../../../utils';
import { Rank } from '../rank';

export type IEmployee = Instance<typeof Employee>;

const Entity = types
    .model('Employee', {
        id: types.identifier,
        type: types.enumeration(Object.values(EMPLOYEE_TYPE)),
        firstName: types.string,
        lastName: types.string,
        surname: types.string,
        rank: types.reference(Rank),
        position: types.string,
        createdAt: types.dayjs,
        updatedAt: types.dayjs,
    })
    .actions((self) => ({
        updateFields(data: Partial<IEmployeeValue>) {
            Object.assign(self, data);
        },
    }))
    .views((self) => ({
        get fullName() {
            return `${self.rank.shortName} ${str.toUpperFirst(self.lastName)} ${str.toUpper(self.firstName[0])}. ${str.toUpper(self.surname[0])}.`;
        },

        get signName() {
            return `${str.toUpper(self.firstName[0])}.${str.toUpper(self.surname[0])}. ${str.toUpperFirst(self.lastName)}`;
        },
    }));

const update = asyncAction<Instance<typeof Entity>>(
    (data: UpdateValue<IEmployeeValue>) =>
        async function fn({ flow, self }) {
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
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

export const Employee = Entity.props({ update });
