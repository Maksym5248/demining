import { type Dayjs } from 'dayjs';

import {
    type IExplosiveObjectActionDTOParams,
    type IMissionReportDTO,
    type IMissionReportDTOParams,
    type IMissionReportPreviewDTO,
    type IMissionReportSumDTO,
} from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { createExplosiveObjectActionDTO } from '~/stores';
import { type IExplosiveActionDataParams, createExplosiveDeviceActionDTO } from '~/stores';
import { type IMapViewActionDataParams, createMapViewDTO } from '~/stores/map';

import { type IAddressData, createAddress, createAddressDTO } from '../address';

export interface IMissionReportDataParams {
    approvedAt: Dayjs;
    approvedById: string;
    number: number;
    subNumber?: number;
    executedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    checkedTerritory?: number;
    depthExamination?: number;
    uncheckedTerritory?: number;
    uncheckedReason?: string;
    mapView: IMapViewActionDataParams;
    workStart: Dayjs;
    exclusionStart?: Dayjs;
    transportingStart?: Dayjs;
    destroyedStart?: Dayjs;
    workEnd: Dayjs;
    transportExplosiveObjectId?: string;
    transportHumansId?: string;
    mineDetectorId?: string;
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
    addressDetails: IAddressData;
    explosiveActions?: IExplosiveActionDataParams[];
}

export interface IMissionReportSumValue {
    total: number;
}

export interface IMissionReportData {
    id: string;
    approvedAt: Dayjs;
    number: number;
    subNumber?: number;
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
    addressDetails: IAddressData;
    createdAt: Dayjs;
    updatedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    approvedByActionId?: string;
    mapViewId?: string;
    transportActionsIds?: string[];
    equipmentActionsIds?: string[];
    explosiveObjectActionsIds?: string[];
    squadLeaderActionId?: string;
    squadActionsIds?: string[];
    explosiveActionsIds?: string[];
}

export const createMissionReportDTO = (value: ICreateValue<IMissionReportDataParams>): ICreateValue<IMissionReportDTOParams> => ({
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
    explosiveActions: value.explosiveActions?.map(el => createExplosiveDeviceActionDTO(el)) ?? [],
    squadLeaderId: value.squadLeaderId,
    squadIds: value.squadIds,
    address: value.address ?? '',
    addressDetails: createAddressDTO(value?.addressDetails),
});

export const createMissionReportPreview = (value: IMissionReportPreviewDTO): IMissionReportData => ({
    id: value.id,
    approvedAt: dates.fromServerDate(value.approvedAt),
    number: value.number,
    orderId: value.orderId,
    missionRequestId: value.missionRequestId,
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

export const createMissionReport = (value: IMissionReportDTO): IMissionReportData => ({
    ...createMissionReportPreview(value),
    approvedByActionId: value.approvedByAction.id,
    orderId: value.order.id,
    missionRequestId: value.missionRequestId,
    mapViewId: value.mapView.id,
    explosiveObjectActionsIds: value.explosiveObjectActions.map(el => el.id),
    squadLeaderActionId: value.squadLeaderAction.id,
    squadActionsIds: value.squadActions.map(el => el.id),
    transportActionsIds: value.transportActions.map(el => el.id),
    equipmentActionsIds: value.equipmentActions.map(el => el.id),
    explosiveActionsIds: value.explosiveActions.map(el => el.id),
});

export const createMissionReportSum = (value: IMissionReportSumDTO): IMissionReportSumValue => ({
    total: value.total,
});
