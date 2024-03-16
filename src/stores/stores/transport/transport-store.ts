import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, ITransportDTO } from '~/api'
import { TRANSPORT_TYPE } from '~/constants';
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { ITransport, ITransportValue, Transport, createTransport, createTransportDTO } from './entities';

const Store = types
	.model('TransportStore', {
		collection: createCollection<ITransport, ITransportValue>("Transports", Transport),
		list: createList<ITransport>("TransportsList", safeReference(Transport), { pageSize: 10 }),
	}).actions((self) => ({
		push: (values: ITransportDTO[]) => {
			self.list.checkMore(values.length);

			values.forEach((el) => {
				const value = createTransport(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		},
		set(values: ITransportDTO[]){
			self.list.checkMore(values.length);
			self.list.clear();

			values.forEach((el) => {
				const value = createTransport(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		}
	})).views((self) => ({
		get transportExplosiveObjectList(){
			return self.list.asArray.filter(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS);
		},
		get transportHumansList(){
			return self.list.asArray.filter(el => el.type === TRANSPORT_TYPE.FOR_HUMANS);
		},
	})).views((self) => ({
		get transportExplosiveObjectFirst(){
			return self.transportExplosiveObjectList[0];
		},
		get transportHumansFirst(){
			return self.transportHumansList[0];
		},
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<ITransportValue>) => async function fn({ flow, self }) {
	try {
		flow.start();

		const res = await Api.transport.create(createTransportDTO(data));
		const value = createTransport(res);

		self.collection.set(value.id, value);
		self.list.unshift(value.id);
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
		await Api.transport.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось видалити');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {    
	try {
		flow.start();

		const res = await Api.transport.getList({
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
		flow.start();

		const res = await Api.transport.getList({
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

export const TransportStore = Store.props({ create, remove, fetchList, fetchListMore })
