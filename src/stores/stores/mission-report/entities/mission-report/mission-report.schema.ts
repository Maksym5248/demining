import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates } from '~/utils';
import { IExplosiveObjectActionDTOParams, IMapViewActionDTO, IMapViewActionDTOParams, IMissionReportDTO, IMissionReportDTOParams } from '~/api';
import { IEmployeeActionValue, createEmployeeAction } from '~/stores/stores/employee';
import { ILinkedToDocumentDB } from '~/db';
import { ITransportActionValue, createTransportAction } from '~/stores/stores/transport/entities/transport-action';
import { IEquipmentActionValue, createEquipmentAction } from '~/stores/stores/equipment/entities/equipment-action';
import { IExplosiveObjectActionValue, createExplosiveObjectAction } from '~/stores/stores/explosive-object';


export interface IMapViewActionValueParams extends IMapViewActionDTOParams {};
export interface IMapViewActionValue extends ILinkedToDocumentDB {
    id: string;
    markerLat: number;
    markerLng: number;
    circleCenterLat: number;
    circleCenterLng: number;
    circleRadius: number;
    zoom: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IMissionReportValueParams {
	approvedAt: Dayjs;
    approvedById:  string;
    number: number;
    subNumber: number | undefined,
    executedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    mapView: IMapViewActionValueParams;
    workStart: Dayjs;
    exclusionStart: Dayjs | undefined;
    transportingStart: Dayjs | undefined;
    destroyedStart: Dayjs | undefined;
    workEnd: Dayjs;
    transportExplosiveObjectId: string;
    transportHumansId: string;
    mineDetectorId: string,
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
};

export interface IMissionReportValue {
	id: string;
    approvedAt: Dayjs;
    number: number;
    subNumber: number | undefined,
    executedAt: Dayjs;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    workStart: Dayjs;
    exclusionStart: Dayjs | undefined;
    transportingStart: Dayjs | undefined;
    destroyedStart: Dayjs | undefined;
    workEnd: Dayjs;
    address: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
	order: string;
    missionRequest: string;
    approvedByAction: IEmployeeActionValue;
	mapView: IMapViewActionValue;
	transportActions: ITransportActionValue[];
	equipmentActions: IEquipmentActionValue[];
	explosiveObjectActions: IExplosiveObjectActionValue[];
	squadLeaderAction: IEmployeeActionValue;
	squadActions: IEmployeeActionValue[]
}
  
export const createMissionReportDTO = (value: CreateValue<IMissionReportValueParams>): CreateValue<IMissionReportDTOParams>  => ({
	approvedAt: dates.toDateServer(value.approvedAt),
	approvedById: value.approvedById,
	number: value.number,
	subNumber: value.subNumber,
	executedAt: dates.toDateServer(value.approvedAt),
	orderId: value.orderId,
	missionRequestId: value.missionRequestId,
	checkedTerritory: value.checkedTerritory,
	depthExamination: value.depthExamination,
	uncheckedTerritory: value.uncheckedTerritory,
	uncheckedReason: value.uncheckedReason,
	mapView: value.mapView,
	workStart: dates.toDateServer(value.approvedAt),
	exclusionStart: value.exclusionStart ? dates.toDateServer(value.exclusionStart) : undefined,
	transportingStart: value.transportingStart ? dates.toDateServer(value.transportingStart) : undefined,
	destroyedStart: value.destroyedStart ? dates.toDateServer(value.destroyedStart) : undefined,
	workEnd: dates.toDateServer(value.workEnd),
	transportExplosiveObjectId: value.transportExplosiveObjectId,
	transportHumansId: value.transportHumansId,
	mineDetectorId: value.mineDetectorId,
	explosiveObjectActions: value.explosiveObjectActions,
	squadLeaderId: value.squadLeaderId,
	squadIds: value.squadIds,
	address: value.address,
});

export const createMapView = (value: IMapViewActionDTO): IMapViewActionValue => ({
	id: value.id,
	documentId: value.documentId,
	documentType: value.documentType,
	markerLat: value.markerLat,
	markerLng: value.markerLng,
	circleCenterLat: value.circleCenterLat,
	circleCenterLng: value.circleCenterLng,
	circleRadius: value.circleRadius,
	zoom: value.zoom,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
});

export const createMissionReport = (value: IMissionReportDTO): IMissionReportValue => ({
	id: value.id,
	approvedAt: dates.create(value.approvedAt),
	approvedByAction: createEmployeeAction(value.approvedByAction),
	number: value.number,
	subNumber: value.subNumber,
	executedAt: dates.create(value.executedAt),
	order: value.order.id,
	missionRequest: value.missionRequest.id,
	checkedTerritory: value.checkedTerritory,
	depthExamination: value.depthExamination,
	uncheckedTerritory: value.uncheckedTerritory,
	uncheckedReason: value.uncheckedReason,
	mapView: createMapView(value.mapView),
	workStart: dates.create(value.workStart),
	exclusionStart: value.exclusionStart ? dates.create(value.exclusionStart) : undefined,
	transportingStart: value.transportingStart ? dates.create(value.transportingStart) : undefined,
	destroyedStart: value.destroyedStart ? dates.create(value.destroyedStart) : undefined,
	workEnd: dates.create(value.workEnd),
	explosiveObjectActions: value.explosiveObjectActions.map(el => createExplosiveObjectAction(el)),
	squadLeaderAction: createEmployeeAction(value.squadLeaderAction),
	squadActions: value.squadActions.map(el => createEmployeeAction(el)),
	transportActions: value.transportActions.map(el => createTransportAction(el)),
	equipmentActions: value.equipmentActions.map(el => createEquipmentAction(el)),
	address: value.address,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
});
