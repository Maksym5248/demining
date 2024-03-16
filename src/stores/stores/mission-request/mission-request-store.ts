import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IMissionRequestDTO } from '~/api'
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IMissionRequest, IMissionRequestValue, MissionRequest, createMissionRequest, createMissionRequestDTO } from './entities';

const Store = types
	.model('MissionRequestStore', {
		collection: createCollection<IMissionRequest, IMissionRequestValue>("MissionRequests", MissionRequest),
		list: createList<IMissionRequest>("MissionRequestsList", safeReference(MissionRequest), { pageSize: 10 }),
	}).actions((self) => ({
		push: (values: IMissionRequestDTO[]) => {
			self.list.checkMore(values.length);
			values.forEach((el) => {
				const value = createMissionRequest(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		},
		set(values: IMissionRequestDTO[]){
			self.list.checkMore(values.length);
			self.list.clear();

			values.forEach((el) => {
				const value = createMissionRequest(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IMissionRequestValue>) => async function fn({ flow, self }) {
	try {
		flow.start();

		const res = await Api.missionRequest.create(createMissionRequestDTO(data));
		const missionRequest = createMissionRequest(res);

		self.collection.set(missionRequest.id, missionRequest);
		self.list.unshift(missionRequest.id);
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
		await Api.missionRequest.remove(id);
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

		const res = await Api.missionRequest.getList({
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

		const res = await Api.missionRequest.getList({
			search,
			limit: self.list.pageSize,
			startAfter: dates.toDateServer(self.list.last.createdAt),
		});

		self.push(res);
		
		flow.success();
	} catch (err) {
		flow.failed(err as Error);
	}
});

export const MissionRequestStore = Store.props({ create, remove, fetchList, fetchListMore })
