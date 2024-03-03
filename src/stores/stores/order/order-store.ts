import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IOrderDTO } from '~/api'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IOrder, IOrderValue, IOrderValueParams, Order, createOrder, createOrderDTO } from './entities';

const Store = types
	.model('OrderStore', {
		collection: createCollection<IOrder, IOrderValue>("Orders", Order),
		list: createList<IOrder>("OrdersList", safeReference(Order), { pageSize: 20 }),
	}).actions((self) => ({
		push: (values: IOrderDTO[]) => {
			values.forEach((el) => {
				const order = createOrder(el);

				if(!self.collection.has(order.id)){
					self.collection.set(order.id, order);
					self.list.push(order.id);
				}
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IOrderValueParams>) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.order.create(createOrderDTO(data));

		const order = createOrder(res);

		self.collection.set(order.id, order);
		self.list.unshift(order.id);

		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		console.log("error", err)
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();
		await Api.order.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось видалити');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>(() => async function addEmployeeFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();
		const res = await Api.order.getList();

		self.push(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const OrderStore = Store.props({ create, remove, fetchList })
