import { message } from 'antd';
import { Instance } from 'mobx-state-tree';

import { Api } from '~/api';
import { UpdateValue } from '~/types';

import { IOrderValue, IOrderValueParams, createOrder, updateOrderDTO } from './order.schema';
import { types } from '../../../../types';
import { asyncAction } from '../../../../utils';
import { EmployeeAction } from '../../../employee';

export type IOrder = Instance<typeof Order>;

const Entity = types
    .model('Order', {
        id: types.identifier,
        signedAt: types.dayjs,
        number: types.number,
        createdAt: types.dayjs,
        updatedAt: types.dayjs,
    })
    .props({
        signedByAction: types.maybe(types.maybe(types.reference(EmployeeAction))),
    })
    .actions((self) => ({
        updateFields(data: Partial<IOrderValue>) {
            Object.assign(self, data);
        },
    }))
    .views((self) => ({
        get displayValue() {
            return `№${self.number} ${self.signedAt.format('DD/MM/YYYY')}`;
        },
    }));

const update = asyncAction<Instance<typeof Entity>>(
    (data: UpdateValue<IOrderValueParams>) =>
        async function addFlow({ flow, self }) {
            try {
                flow.start();

                const res = await Api.order.update(self.id, updateOrderDTO(data));

                self.updateFields(createOrder(res));

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

export const Order = Entity.props({ update });
