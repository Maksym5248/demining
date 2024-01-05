import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { UpdateValue } from '~/types'
import { Api } from '~/api'

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { EmployeeHistory } from '../../../employee';
import { IOrderValue, IOrderValueParams, createOrder, updateOrderDTO } from './order.schema';

export type IOrder = Instance<typeof Order>

const Entity = types.model('Order', {
	id: types.identifier,
	signedAt: types.dayjs,
	signedByHistory: EmployeeHistory.named("EmployeeOrder"),
	number: types.number,
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).actions((self) => ({
	updateFields(data: Partial<IOrderValue>) {
		Object.assign(self, data);
	}
}));


const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IOrderValueParams>) => async function addFlow({ flow, self }) {
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
		flow.failed(err as Error)
		message.error('Не вдалось додати');
	}
});

export const Order = Entity.props({ update });