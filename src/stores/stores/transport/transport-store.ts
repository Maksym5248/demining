import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'
import { TRANSPORT_TYPE } from '~/constants';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { ITransport, ITransportValue, Transport, createTransport, createTransportDTO } from './entities';

const Store = types
	.model('TransportStore', {
		collection: createCollection<ITransport, ITransportValue>("Transports", Transport),
		list: createList<ITransport>("TransportsList", safeReference(Transport), { pageSize: 20 }),
	}).views((self) => ({
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

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<ITransportValue>) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.transport.create(createTransportDTO(data));
		const value = createTransport(res);

		self.collection.set(res.id, value);
		self.list.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		console.log("e", err);
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();
		await Api.transport.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		message.error('Не вдалось видалити');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>(() => async function addEmployeeFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();

		const list = await Api.transport.getList();

		list.forEach((el) => {
			const item = createTransport(el);

			if(!self.collection.has(item.id)){
				self.collection.set(item.id, item);
				self.list.push(item.id);
			}
		})

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
	}
});

export const TransportStore = Store.props({ create, remove, fetchList })
