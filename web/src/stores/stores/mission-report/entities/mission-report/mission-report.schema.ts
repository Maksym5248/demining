import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { dates } from '~/utils';
import { IExplosiveActionDTOParams, IExplosiveObjectActionDTOParams, IMissionReportDTO, IMissionReportDTOParams, IMissionReportPreviewDTO, IMissionReportSumDTO } from '~/api';
import { IMapViewActionValueParams, createMapViewDTO } from '~/stores/stores/map';
import { createExplosiveActionDTO } from '~/stores/stores/explosive';
import { createExplosiveObjectActionDTO } from '~/stores';

import { IAddressValue, createAddress, createAddressDTO } from '../address';

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
	addressDetails: IAddressValue;
	explosiveActions?: IExplosiveActionDTOParams[];
};

export interface IMissionReportSumValue {
	total: number;
}

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
	addressDetails: IAddressValue;
    createdAt: Dayjs;
    updatedAt: Dayjs;
	order?: string;
    missionRequest?: string;
    approvedByAction?: string;
	mapView?: string;
	transportActions?: string[];
	equipmentActions?: string[];
	explosiveObjectActions?: string[];
	squadLeaderAction?: string;
	squadActions?: string[];
	explosiveActions?: string[];
}
  
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
	explosiveObjectActions: value.explosiveObjectActions.map(el => createExplosiveObjectActionDTO(el)),
	explosiveActions: value.explosiveActions?.map(el => createExplosiveActionDTO(el)) ?? [],
	squadLeaderId: value.squadLeaderId,
	squadIds: value.squadIds,
	address: value.address ?? "",
	addressDetails: createAddressDTO(value?.addressDetails),
});

export const createMissionReportPreview = (value: IMissionReportPreviewDTO): IMissionReportValue => ({
	id: value.id,
	approvedAt: dates.fromServerDate(value.approvedAt),
	number: value.number,
	subNumber: value.subNumber ?? undefined,
	executedAt: dates.fromServerDate(value.executedAt),
	checkedTerritory: value.checkedTerritory ?? undefined,
	depthExamination: value.depthExamination ?? undefined,
	uncheckedTerritory: value.uncheckedTerritory ?? undefined,
	uncheckedReason: value.uncheckedReason ?? undefined,
	workStart: dates.fromServerDate(value.workStart),
	exclusionStart: value.exclusionStart ? dates.fromServerDate(value.exclusionStart) : undefined,
	transportingStart: value.transportingStart ? dates.fromServerDate(value.transportingStart) : undefined,
	destroyedStart: value.destroyedStart ? dates.fromServerDate(value.destroyedStart) : undefined,
	workEnd: dates.fromServerDate(value.workEnd),
	address: value.address,
	addressDetails: createAddress(value?.addressDetails),
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});

export const createMissionReport = (value: IMissionReportDTO): IMissionReportValue => ({
	...createMissionReportPreview(value),
	approvedByAction: value.approvedByAction.id,
	order: value.order.id,
	missionRequest: value.missionRequest?.id,
	mapView: value.mapView.id,
	explosiveObjectActions: value.explosiveObjectActions.map(el => el.id),
	squadLeaderAction: value.squadLeaderAction.id,
	squadActions: value.squadActions.map(el => el.id),
	transportActions: value.transportActions.map(el => el.id),
	equipmentActions: value.equipmentActions.map(el => el.id),
	explosiveActions: value.explosiveActions.map(el => el.id),
});

export const createMissionReportSum = (value: IMissionReportSumDTO): IMissionReportSumValue => ({
	total: value.total,
});