import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'
import { createOrder } from '~/stores/stores/order';
import { createMissionRequest } from '~/stores/stores/mission-request';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IMissionReport, IMissionReportValue, IMissionReportValueParams, MissionReport, createMissionReport, createMissionReportDTO } from './entities';
import { createExplosiveObjectType } from '../explosive-object';

const Store = types
	.model('MissionReportStore', {
		collection: createCollection<IMissionReport, IMissionReportValue>("MissionReports", MissionReport),
		list: createList<IMissionReport>("MissionReportsList", safeReference(MissionReport), { pageSize: 20 }),
	});

const add = asyncAction<Instance<typeof Store>>((data: CreateValue<IMissionReportValueParams>) => async function addFlow({ flow, self, root }) {
	try {
		flow.start();

		const res = await Api.missionReport.add(createMissionReportDTO(data));

		root.order.collection.set(res.order.id, createOrder(res.order));
		root.missionRequest.collection.set(res.missionRequest.id, createMissionRequest(res.missionRequest));

		self.collection.set(res.id, createMissionReport(res));
		self.list.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		console.log("ERROR add", err)
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>(() => async function addFlow({ flow, self, root }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();

		const res = await Api.missionReport.getList();

		res.forEach((el) => {
			el.explosiveObjectActions.forEach((item) => {
				root.explosiveObject.collectionTypes.set(item.type.id, createExplosiveObjectType(item.type));
			})

			if(!root.order.collection.has(el.order.id)){
				root.order.collection.set(el.order.id, createOrder(el.order));
				root.order.list.push(el.order.id);
			}

			if(!root.missionRequest.collection.has(el.missionRequest.id)){
				root.missionRequest.collection.set(el.missionRequest.id, createMissionRequest(el.missionRequest));
				root.missionRequest.list.push(el.missionRequest.id);
			}

			const missionReport = createMissionReport(el);

			if(!self.collection.has(missionReport.id)){
				self.collection.set(missionReport.id, missionReport);
				self.list.push(missionReport.id);
			}
		})

		flow.success();
	} catch (err) {
		console.log("ERROR fetchList", err)
		flow.failed(err as Error);
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();
		await Api.missionReport.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		message.error('Не вдалось видалити');
	}
});

export const MissionReportStore = Store.props({ add, remove, fetchList })
