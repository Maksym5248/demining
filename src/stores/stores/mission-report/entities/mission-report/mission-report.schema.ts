import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates } from '~/utils';
import { IExplosiveObjectActionDTOParams, IMapViewActionDTO, IMapViewActionDTOParams, IMissionReportDTO, IMissionReportDTOParams, IMissionReportPreviewDTO } from '~/api';
import { ILinkedToDocumentDB } from '~/db';


export interface IMapViewActionValueParams extends IMapViewActionDTOParams {};
export interface IMapViewActionValue extends ILinkedToDocumentDB {
    id: string;
    markerLat: number;
    markerLng: number;
    circleCenterLat?: number;
    circleCenterLng?: number;
    circleRadius?: number;
    zoom: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IMissionReportValueParams {
	approvedAt: Dayjs;
    approvedById:  string;
    number: number;
    subNumber: number | null,
    executedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number |null;
    uncheckedTerritory: number |null;
    uncheckedReason: string | null;
    mapView: IMapViewActionValueParams;
    workStart: Dayjs;
    exclusionStart: Dayjs | null;
    transportingStart: Dayjs | null;
    destroyedStart: Dayjs | null;
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
    subNumber?: number,
    executedAt: Dayjs;
    checkedTerritory?: number;
    depthExamination?: number;
    uncheckedTerritory?: number;
    uncheckedReason?: string;
    workStart: Dayjs;
    exclusionStart?: Dayjs;
    transportingStart?: Dayjs;
    destroyedStart?: Dayjs;
    workEnd: Dayjs;
    address: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
	order?: string;
    missionRequest?: string;
    approvedByAction?: string;
	mapView?: IMapViewActionValue;
	transportActions?: string[];
	equipmentActions?: string[];
	explosiveObjectActions?: string[];
	squadLeaderAction?: string;
	squadActions?: string[]
}

export const createMapViewDTO = (value?: IMapViewActionValueParams): IMapViewActionDTOParams  => ({
	markerLat: value?.markerLat ?? 0,
	markerLng: value?.markerLng ?? 0,
	circleCenterLat: value?.circleCenterLat ?? null,
	circleCenterLng: value?.circleCenterLng ?? null,
	circleRadius: value?.circleRadius ?? null,
	zoom: value?.zoom ?? 1,
});
  
export const createMissionReportDTO = (value: CreateValue<IMissionReportValueParams>): CreateValue<IMissionReportDTOParams>  => ({
	approvedAt: dates.toDateServer(value.approvedAt),
	approvedById: value.approvedById,
	number: value.number,
	subNumber: value.subNumber ?? null,
	executedAt: dates.toDateServer(value.approvedAt),
	orderId: value.orderId,
	missionRequestId: value.missionRequestId,
	checkedTerritory: value.checkedTerritory ?? null,
	depthExamination: value.depthExamination ?? null,
	uncheckedTerritory: value.uncheckedTerritory ?? null,
	uncheckedReason: value.uncheckedReason ?? null,
	mapView: createMapViewDTO(value.mapView),
	workStart: dates.toDateServer(value.workStart),
	exclusionStart: value.exclusionStart ? dates.toDateServer(value.exclusionStart) : null,
	transportingStart: value.transportingStart ? dates.toDateServer(value.transportingStart) : null,
	destroyedStart: value.destroyedStart ? dates.toDateServer(value.destroyedStart) : null,
	workEnd: dates.toDateServer(value.workEnd),
	transportExplosiveObjectId: value.transportExplosiveObjectId,
	transportHumansId: value.transportHumansId,
	mineDetectorId: value.mineDetectorId,
	explosiveObjectActions: value.explosiveObjectActions,
	squadLeaderId: value.squadLeaderId,
	squadIds: value.squadIds,
	address: value.address ?? "",
});

export const createMapView = (value: IMapViewActionDTO): IMapViewActionValue => ({
	id: value.id,
	documentId: value.documentId,
	documentType: value.documentType,
	markerLat: value.markerLat,
	markerLng: value.markerLng,
	circleCenterLat: value.circleCenterLat ?? undefined,
	circleCenterLng: value.circleCenterLng ?? undefined,
	circleRadius: value.circleRadius ?? undefined,
	zoom: value.zoom,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
});

export const createMissionReportPreview = (value: IMissionReportPreviewDTO): IMissionReportValue => ({
	id: value.id,
	approvedAt: dates.create(value.approvedAt),
	number: value.number,
	subNumber: value.subNumber ?? undefined,
	executedAt: dates.create(value.executedAt),
	checkedTerritory: value.checkedTerritory ?? undefined,
	depthExamination: value.depthExamination ?? undefined,
	uncheckedTerritory: value.uncheckedTerritory ?? undefined,
	uncheckedReason: value.uncheckedReason ?? undefined,
	workStart: dates.create(value.workStart),
	exclusionStart: value.exclusionStart ? dates.create(value.exclusionStart) : undefined,
	transportingStart: value.transportingStart ? dates.create(value.transportingStart) : undefined,
	destroyedStart: value.destroyedStart ? dates.create(value.destroyedStart) : undefined,
	workEnd: dates.create(value.workEnd),
	address: value.address,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
});

export const createMissionReport = (value: IMissionReportDTO): IMissionReportValue => ({
	...createMissionReportPreview(value),
	approvedByAction: value.approvedByAction.id,
	order: value.order.id,
	missionRequest: value.missionRequest?.id,
	mapView: createMapView(value.mapView),
	explosiveObjectActions: value.explosiveObjectActions.map(el => el.id),
	squadLeaderAction: value.squadLeaderAction.id,
	squadActions: value.squadActions.map(el => el.id),
	transportActions: value.transportActions.map(el => el.id),
	equipmentActions: value.equipmentActions.map(el => el.id),
});
