import { Instance } from 'mobx-state-tree';

import { EmployeeAction } from '~/stores/stores/employee';
import { Order } from '~/stores/stores/order';
import { MissionRequest } from '~/stores/stores/mission-request';
import { ExplosiveObjectAction } from '~/stores/stores/explosive-object';
import { TransportAction } from '~/stores/stores/transport/entities/transport-action';
import { EquipmentAction } from '~/stores/stores/equipment/entities/equipment-action';

import { types } from '../../../../types'
import { IMissionReportValue } from './mission-report.schema';

export type IMissionReport = Instance<typeof MissionReport>

const MapView = types.model('MapView', {
	id: types.identifier,
	markerLat: types.number,
	markerLng: types.number,
	circleCenterLat: types.maybe(types.number),
	circleCenterLng: types.maybe(types.number),
	circleRadius: types.maybe(types.number),
	zoom: types.number,
	createdAt: types.dayjs,
	updatedAt: types.dayjs
});

const Entity = types.model('MissionReport', {
	id: types.identifier,
	approvedAt: types.dayjs,
	approvedByAction: EmployeeAction.named("EmployeeActionMissionReport"),
	number: types.number,
	subNumber: types.maybe(types.number),
	executedAt: types.dayjs,
	order: types.reference(Order),
	missionRequest: types.reference(MissionRequest),
	checkedTerritory: types.maybe(types.number),
	depthExamination: types.maybe(types.number),
	uncheckedTerritory: types.maybe(types.number),
	uncheckedReason: types.maybe(types.string),
	mapView: MapView.named("MapViewMissionReport"),
	workStart: types.dayjs,
	exclusionStart: types.maybe(types.dayjs),
	transportingStart: types.maybe(types.dayjs),
	destroyedStart:types.maybe(types.dayjs),
	workEnd: types.dayjs,
	explosiveObjectActions: types.optional(types.array(ExplosiveObjectAction), []),
	squadLeaderAction: EmployeeAction.named("EmployeeActionMissionReport"),
	squadActions: types.optional(types.array(EmployeeAction.named("EmployeeActionMissionReport")), []),
	transportActions: types.optional(types.array(TransportAction), []),
	equipmentActions: types.optional(types.array(EquipmentAction), []),
	address: types.string,
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).actions((self) => ({
	updateFields(data: Partial<IMissionReportValue>) {
		Object.assign(self, data);
	}
}));

export const MissionReport = Entity;