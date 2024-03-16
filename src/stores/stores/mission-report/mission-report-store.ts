import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IMissionReportPreviewDTO } from '~/api'
import { createOrder } from '~/stores/stores/order';
import { createMissionRequest } from '~/stores/stores/mission-request';
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IMissionReport, IMissionReportValue, IMissionReportValueParams, MissionReport, createMissionReport, createMissionReportDTO, createMissionReportPreview } from './entities';

const Store = types
	.model('MissionReportStore', {
		collection: createCollection<IMissionReport, IMissionReportValue>("MissionReports", MissionReport),
		list: createList<IMissionReport>("MissionReportsList", safeReference(MissionReport), { pageSize: 10 }),
	}).actions((self) => ({
		push: (values: IMissionReportPreviewDTO[]) => {
			self.list.checkMore(values.length);
			values.forEach((el) => {
				const value = createMissionReportPreview(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		},
		set(values: IMissionReportPreviewDTO[]){
			self.list.checkMore(values.length);
			self.list.clear();

			values.forEach((el) => {
				const value = createMissionReportPreview(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IMissionReportValueParams>) => async function addFlow({ flow, self, root }) {
	try {
		flow.start();

		const res = await Api.missionReport.create(createMissionReportDTO(data));

		root.order.collection.set(res.order.id, createOrder(res.order));
		root.missionRequest.collection.set(res.missionRequest.id, createMissionRequest(res.missionRequest));

		self.collection.set(res.id, createMissionReport(res));
		self.list.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

const update = asyncAction<Instance<typeof Store>>((id: string, data: CreateValue<IMissionReportValueParams>) => async function addFlow({ flow, self, root }) {
	try {
		flow.start();

		const res = await Api.missionReport.update(id, createMissionReportDTO(data));

		root.order.collection.set(res.order.id, createOrder(res.order));
		root.missionRequest.collection.set(res.missionRequest.id, createMissionRequest(res.missionRequest));
		self.collection.set(res.id, createMissionReport(res));

		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>((search: string) => async function addFlow({ flow, self }) {    
	try {
		flow.start();

		const res = await Api.missionReport.getList({
			search,
			limit: self.list.pageSize,
		});

		self.set(res)

		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

const fetchListMore = asyncAction<Instance<typeof Store>>((search: string) => async function addFlow({ flow, self }) {    
	try {
		if(!self.list.isMorePages) return;

		flow.start();

		const res = await Api.missionReport.getList({
			search,
			limit: self.list.pageSize,
			startAfter: dates.toDateServer(self.list.last.createdAt),
		});

		self.push(res)

		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

const fetchItem = asyncAction<Instance<typeof Store>>((id:string) => async function addFlow({ flow, self, root }) {
	try {
		flow.start();

		const el = await Api.missionReport.get(id);

		if(!root.order.collection.has(el.order.id)){
			root.order.collection.set(el.order.id, createOrder(el.order));
			root.order.list.push(el.order.id);
		}

		if(!root.missionRequest.collection.has(el.missionRequest.id)){
			root.missionRequest.collection.set(el.missionRequest.id, createMissionRequest(el.missionRequest));
			root.missionRequest.list.push(el.missionRequest.id);
		}

		const missionReport = createMissionReport(el);

		self.collection.set(missionReport.id, missionReport);

		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function fn({ flow, self }) {
	try {
		flow.start();
		await Api.missionReport.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось видалити');
	}
});

export const MissionReportStore = Store.props({ create, update, remove, fetchList, fetchListMore, fetchItem })
