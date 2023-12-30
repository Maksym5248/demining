import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IMissionRequest, IMissionRequestValue, MissionRequest, createMissionRequest, createMissionRequestDTO } from './entities';

const Store = types
	.model('MissionRequestStore', {
		collection: createCollection<IMissionRequest, IMissionRequestValue>("MissionRequests", MissionRequest),
		list: createList<IMissionRequest>("MissionRequestsList", safeReference(MissionRequest), { pageSize: 20 }),
	});

const add = asyncAction<Instance<typeof Store>>((data: CreateValue<IMissionRequestValue>) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.missionRequest.add(createMissionRequestDTO(data));
		const missionRequest = createMissionRequest(res);

		self.collection.set(res.id, missionRequest);
		self.list.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();
		await Api.missionRequest.remove(id);
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

		const res = await Api.missionRequest.getList();

		res.forEach((el) => {
			const missionRequest = createMissionRequest(el);

			if(!self.collection.has(missionRequest.id)){
				self.collection.set(missionRequest.id, missionRequest);
				self.list.push(missionRequest.id);
			}
		})

		flow.success();
	} catch (err) {
		flow.failed(err);
	}
});

export const MissionRequestStore = Store.props({ add, remove, fetchList })
