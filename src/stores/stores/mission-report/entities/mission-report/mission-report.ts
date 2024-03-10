import { Instance } from 'mobx-state-tree';
import { toLower } from 'lodash';
import { Dayjs } from 'dayjs';

import { EmployeeAction } from '~/stores/stores/employee';
import { Order } from '~/stores/stores/order';
import { MissionRequest } from '~/stores/stores/mission-request';
import { ExplosiveObjectAction } from '~/stores/stores/explosive-object';
import { TransportAction } from '~/stores/stores/transport/entities/transport-action';
import { EquipmentAction } from '~/stores/stores/equipment/entities/equipment-action';
import { dates, str } from '~/utils';
import { EQUIPMENT_TYPE, TRANSPORT_TYPE } from '~/constants';

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
	number: types.number,
	subNumber: types.maybe(types.number),
	executedAt: types.dayjs,
	checkedTerritory: types.maybe(types.number),
	depthExamination: types.maybe(types.number),
	uncheckedTerritory: types.maybe(types.number),
	uncheckedReason: types.maybe(types.string),
	workStart: types.dayjs,
	exclusionStart: types.maybe(types.dayjs),
	transportingStart: types.maybe(types.dayjs),
	destroyedStart:types.maybe(types.dayjs),
	workEnd: types.dayjs,
	address: types.string,
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).props({
	approvedByAction: types.maybe(EmployeeAction.named("EmployeeActionMissionReport")),
	order: types.maybe(types.reference(Order)),
	missionRequest:  types.maybe(types.reference(MissionRequest)),
	mapView: types.maybe(MapView.named("MapViewMissionReport")),
	explosiveObjectActions: types.optional(types.array(ExplosiveObjectAction), []),
	squadLeaderAction: types.maybe(EmployeeAction.named("EmployeeActionMissionReport")),
	squadActions: types.optional(types.array(EmployeeAction.named("EmployeeActionMissionReport")), []),
	transportActions: types.optional(types.array(TransportAction), []),
	equipmentActions: types.optional(types.array(EquipmentAction), []),
}).actions((self) => ({
	updateFields(data: Partial<IMissionReportValue>) {
		Object.assign(self, data);
	}
})).views((self) => ({
	get data() {
		const {
			approvedAt,
			approvedByAction,
			number,
			subNumber,
			executedAt,
			order,
			missionRequest,
			address,
			mapView,
			checkedTerritory,
			uncheckedTerritory,
			depthExamination,
			uncheckedReason,
			explosiveObjectActions,
			workStart,
			exclusionStart,
			transportingStart,
			destroyedStart,
			workEnd,
			squadActions,
			squadLeaderAction,
			transportActions,
			equipmentActions
		} = self;

		const getDate = (date?: Dayjs, empty?:string) => date
			? `«${date.format("DD")}» ${toLower(dates.formatGenitiveMonth(date))} ${date.format("YYYY")} року`
			: (empty ?? "`«--» ------ року`");

		const getTime = (start?:Dayjs, end?:Dayjs) => start && end
			? `з ${start?.format("HH")} год. ${start?.format("mm")} хв. по ${end?.format("HH")} год. ${end?.format("mm")} хв.`
			: "з ---- по ----";

		const actNumber = `${number}${subNumber ? `/${subNumber}` : ""}`;

		return {
			approvedAt: getDate(approvedAt),
			approvedByName: `${str.toUpperFirst(approvedByAction?.firstName ?? "")} ${str.toUpper(approvedByAction?.lastName ?? "")}`,
			approvedByRank: approvedByAction?.rank.fullName ?? "",
			approvedByPosition: approvedByAction?.position ?? "",
			actNumber,
			executedAt: getDate(executedAt),
			orderSignedAt: getDate(order?.signedAt),
			orderNumber: order?.number ?? "",
			missionRequestAt:  getDate(missionRequest?.signedAt),
			missionNumber: missionRequest?.number ?? "",
			address,
			lat: mapView?.markerLat ?? 0,
			lng: mapView?.markerLng ?? 0,
			checkedM2: checkedTerritory ?? "---",
			checkedGA: checkedTerritory ? checkedTerritory / 10000 : "---",
			uncheckedM2: uncheckedTerritory ?? "---",
			uncheckedGA: uncheckedTerritory ? uncheckedTerritory / 10000 : "---",
			depthM2: depthExamination ?? "---",
			uncheckedReason: uncheckedReason ?? "---",
			explosiveObjectsTotal: explosiveObjectActions.reduce((acc, el) => el.quantity + acc, 0),
			explosiveObjects: explosiveObjectActions.reduce((acc, el, i) => {
				const lasSign = explosiveObjectActions.length - 1 === i ? ".": ", ";
				return `${acc}${el.fullDisplayName} – ${el.quantity} од., ${el.category} категорії${lasSign}`;
			},  ""),
			exclusionTime: getTime(exclusionStart, transportingStart ?? destroyedStart ?? workEnd),
			exclusionDate: getDate(exclusionStart, ""),
			transportingTime: getTime(transportingStart, destroyedStart ?? workEnd),
			transportingDate: getDate(transportingStart, ""),
			explosiveObjectsTotalTransport: explosiveObjectActions.reduce((acc, el) => (el.isTransported ? el.quantity: 0) + acc, 0),
			squadTotal: squadActions.length + 1,
			humanHours: (squadActions.length + 1) * (workEnd.hour() - workStart.hour()),
			transportHuman: transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS)?.fullName ?? "--",
			transportExplosiveObjects: transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS)?.fullName ?? "--",
			mineDetector: equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)?.name ?? "--",
			squadLead: squadLeaderAction?.signName ?? "",
			squadPosition: squadActions.reduce((prev, el, i) => `${prev}${el.position}${squadActions.length - 1 !== i ? `\n`: ""}`, ""),
			squadName: squadActions.reduce((prev, el, i) => `${prev}${el.signName}${squadActions.length - 1 !== i ? `\n`: ""}`, ""),
		}
	}
})).views((self) => ({
	get docName(){
		return `${self.executedAt.format("YYYY.MM.DD")} ${self.data.actNumber}`
	},
}));

export const MissionReport = Entity;