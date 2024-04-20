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
import { EQUIPMENT_TYPE, EXPLOSIVE_TYPE, TRANSPORT_TYPE } from '~/constants';
import { MapViewAction } from '~/stores/stores/map';
import { ExplosiveAction, IExplosiveAction } from '~/stores/stores/explosive';
import { IPoint } from '~/types';

import { safeReference } from '../../../../utils';
import { types } from '../../../../types'
import { IMissionReportValue } from './mission-report.schema';
import { Address } from '../address';


export type IMissionReport = Instance<typeof MissionReport>

const getLastSign = (arr: any[], i:number) =>  arr.length - 1 === i ? ".": ", ";

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
	addressDetails: types.optional(Address, {}),
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).props({
	approvedByAction: types.maybe(types.maybe(safeReference(EmployeeAction))),
	order: types.maybe(safeReference(Order)),
	missionRequest:  types.maybe(safeReference(MissionRequest)),
	mapView: types.maybe(safeReference(MapViewAction)),
	explosiveObjectActions: types.optional(types.array(safeReference(ExplosiveObjectAction)), []),
	squadLeaderAction: types.maybe(safeReference(EmployeeAction)),
	squadActions: types.optional(types.array(safeReference(EmployeeAction)), []),
	transportActions: types.optional(types.array(safeReference(TransportAction)), []),
	equipmentActions: types.optional(types.array(safeReference(EquipmentAction)), []),
	explosiveActions: types.optional(types.array(safeReference(ExplosiveAction)), []),
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
			explosiveActions,
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
		const explosive = explosiveActions.filter(el => el.type === EXPLOSIVE_TYPE.EXPLOSIVE) as IExplosiveAction[];
		const detonator = explosiveActions.filter(el => el.type === EXPLOSIVE_TYPE.DETONATOR) as IExplosiveAction[];

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
			lat: mapView?.marker?.lat ? `${mapView?.marker?.lat}°`: "",
			lng: mapView?.marker?.lng ? `${mapView?.marker?.lng}°`: "",
			checkedM2: `${checkedTerritory ?? "---"} м2`,
			checkedGA: `${checkedTerritory ? checkedTerritory / 10000 : "---"} га`,
			uncheckedM2: `${uncheckedTerritory ?? "---"} м2`,
			uncheckedGA: `${uncheckedTerritory ? uncheckedTerritory / 10000 : "---"} га`,
			depthM: depthExamination ?? "---",
			uncheckedReason: uncheckedReason ?? "---",
			explosiveObjectsTotal: explosiveObjectActions.reduce((acc, el) => el.quantity + acc, 0),
			explosiveObjects: explosiveObjectActions.reduce((acc, el, i) => `${acc}${el.fullDisplayName} - ${el.quantity} од., ${el?.category} категорії${getLastSign(explosiveObjectActions, i)}`,  ""),
			explosive: explosive.reduce((acc, el, i) => `${acc}${el.name} - ${el.weight} кг.${getLastSign(explosive, i)}`,  ""),
			detonator: detonator.reduce((acc, el, i) => `${acc}${el.name} - ${el.quantity} од.${getLastSign(detonator, i)}`,  ""),
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
			polygon: mapView?.polygon?.points.map((el: IPoint, i:number) => ({ lat: `${el.lat}°`, lng: `${el.lng}°`, name: i === 0 ? "СТ" : `ПТ${i}`})) ?? [],
		}
	}
})).views((self) => ({
	get docName(){
		return `${self.executedAt.format("YYYY.MM.DD")} ${self.data.actNumber}`
	},

	get transportExplosiveObject(){
		return self?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS)
	},

	get transportHumans(){
		return self?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS)
	},

	get mineDetector(){
		return self?.equipmentActions?.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)
	},
}));

export const MissionReport = Entity;