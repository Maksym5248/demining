import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IOrderPreviewDTO } from '~/api'
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IOrder, IOrderValue, IOrderValueParams, Order, createOrder, createOrderDTO, createOrderPreview } from './entities';

const Store = types
	.model('OrderStore', {
		collection: createCollection<IOrder, IOrderValue>("Orders", Order),
		list: createList<IOrder>("OrdersList", safeReference(Order), { pageSize: 10 }),
	}).actions((self) => ({
		push: (values: IOrderPreviewDTO[]) => {
			self.list.checkMore(values.length);
			values.forEach((el) => {
				const order = createOrderPreview(el);

				self.collection.set(order.id, order);
				self.list.push(order.id);
			})
		},
		set(values: IOrderPreviewDTO[]){
			self.list.checkMore(values.length);
			self.list.clear();

			values.forEach((el) => {
				const value = createOrderPreview(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IOrderValueParams>) => async function fn({ flow, self }) {
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
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function fn({ flow, self }) {
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

const fetchItem = asyncAction<Instance<typeof Store>>((id:string) => async function fn({ flow, self }) {    
	try {
		flow.start();
		const res = await Api.order.get(id);

		self.collection.set(res.id, createOrder(res));

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {
	try {
		flow.start();
		const res = await Api.order.getList({
			search,
			limit: self.list.pageSize,
		});

		self.set(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

const fetchListMore = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {
	try {
		if(!self.list.isMorePages) return;

		flow.start();

		const res = await Api.order.getList({
			search,
			limit: self.list.pageSize,
			startAfter: dates.toDateServer(self.list.last.createdAt),
		});

		self.push(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const OrderStore = Store.props({ create, remove, fetchList, fetchListMore, fetchItem })
