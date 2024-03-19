import { types, Instance, getRoot } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IMissionReportDTO, IMissionReportPreviewDTO } from '~/api'
import { createOrder } from '~/stores/stores/order';
import { createMissionRequest } from '~/stores/stores/mission-request';
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IMissionReport, IMissionReportValue, IMissionReportValueParams, MissionReport, createMissionReport, createMissionReportDTO, createMissionReportPreview } from './entities';
import { createEmployeeAction } from '../employee';
import { createExplosiveObjectAction } from '../explosive-object';
import { createTransportAction } from '../transport';
import { createEquipmentAction } from '../equipment';
import { createMapView } from '../map';

const Store = types
	.model('MissionReportStore', {
		collection: createCollection<IMissionReport, IMissionReportValue>("MissionReports", MissionReport),
		list: createList<IMissionReport>("IMissionReport", safeReference(MissionReport), { pageSize: 10 }),
		searchList: createList<IMissionReport>("IMissionSearchList", safeReference(MissionReport), { pageSize: 10 }),
	}).actions((self) => ({
		appendToCollections(res: IMissionReportDTO){
			const root = getRoot(self) as any;

			root.employee.collectionActions.set(res.approvedByAction?.id, createEmployeeAction(res.approvedByAction));
			root.employee.collectionActions.set(res.squadLeaderAction?.id, createEmployeeAction(res.squadLeaderAction));
			root.map.collectionViewActions.set(res.mapView?.id, createMapView(res.mapView));

			res.squadActions.forEach(el => {
				root.employee.collectionActions.set(el?.id, createEmployeeAction(el))
			});
	
			res.explosiveObjectActions.forEach(el => {
				root.explosiveObject.collectionActions.set(el?.id, createExplosiveObjectAction(el))
			});
	
			res.transportActions.forEach(el => {
				root.transport.collectionActions.set(el?.id, createTransportAction(el))
			});
	
			res.equipmentActions.forEach(el => {
				root.equipment.collectionActions.set(el?.id, createEquipmentAction(el))
			});
	
			root.order.collection.set(res.order.id, createOrder(res.order));
			root.missionRequest.collection.set(res.missionRequest.id, createMissionRequest(res.missionRequest));
	
			self.collection.set(res.id, createMissionReport(res));
		},
		append(res: IMissionReportPreviewDTO[], isSearch: boolean, isMore?:boolean){
			const list = isSearch ? self.searchList : self.list;
			if(isSearch && !isMore) self.searchList.clear();

			list.checkMore(res.length);

			res.forEach((el) => {
				const value = createMissionReportPreview(el);

				self.collection.set(value.id, value);
				if(!list.includes(value.id)) list.push(value.id);
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IMissionReportValueParams>) => async function addFlow({ flow, self }) {
	try {
		flow.start();
		console.log("sssss", createMissionReportDTO(data))
		const res = await Api.missionReport.create(createMissionReportDTO(data));
 		self.appendToCollections(res);
		self.list.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

const update = asyncAction<Instance<typeof Store>>((id: string, data: CreateValue<IMissionReportValueParams>) => async function addFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.missionReport.update(id, createMissionReportDTO(data));

		self.appendToCollections(res);

		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>((search: string) => async function addFlow({ flow, self }) {    
	try {
		const isSearch = !!search;
		const list = isSearch ? self.searchList : self.list

		if(!isSearch && list.length) return;

		flow.start();

		const res = await Api.missionReport.getList({
			search,
			limit: list.pageSize,
		});

		self.append(res, isSearch)

		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

const fetchListMore = asyncAction<Instance<typeof Store>>((search: string) => async function addFlow({ flow, self }) {    
	try {
		const isSearch = !!search;
		const list = isSearch ? self.searchList : self.list

		if(!list.isMorePages) return;

		flow.start();

		const res = await Api.missionReport.getList({
			search,
			limit: list.pageSize,
			startAfter: dates.toDateServer(list.last.createdAt),
		});

		self.append(res, isSearch, true);

		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

const fetchItem = asyncAction<Instance<typeof Store>>((id:string) => async function addFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.missionReport.get(id);

		self.appendToCollections(res);

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
