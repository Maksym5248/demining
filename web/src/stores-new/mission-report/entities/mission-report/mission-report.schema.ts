import { Dayjs } from 'dayjs';

import {
    IExplosiveActionDTOParams,
    IExplosiveObjectActionDTOParams,
    IMissionReportDTO,
    IMissionReportDTOParams,
    IMissionReportPreviewDTO,
    IMissionReportSumDTO,
} from '~/api';
import { createExplosiveObjectActionDTO } from '~/stores';
import { createExplosiveActionDTO } from '~/stores/stores/explosive';
import { IMapViewActionValueParams, createMapViewDTO } from '~/stores/stores/map';
import { CreateValue } from '~/types';
import { dates } from '~/utils';

import { IAddressValue, createAddress, createAddressDTO } from '../address';

export interface IMissionReportValueParams {
    approvedAt: Dayjs;
    approvedById: string;
    number: number;
    subNumber: number | null;
    executedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number | null;
    uncheckedTerritory: number | null;
    uncheckedReason: string | null;
    mapView: IMapViewActionValueParams;
    workStart: Dayjs;
    exclusionStart: Dayjs | null;
    transportingStart: Dayjs | null;
    destroyedStart: Dayjs | null;
    workEnd: Dayjs;
    transportExplosiveObjectId: string;
    transportHumansId: string;
    mineDetectorId: string;
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
    addressDetails: IAddressValue;
    explosiveActions?: IExplosiveActionDTOParams[];
}

export interface IMissionReportSumValue {
    total: number;
}

export interface IMissionReportValue {
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
    addressDetails: IAddressValue;
    createdAt: Dayjs;
    updatedAt: Dayjs;
    orderId?: string;
    missionRequestId?: string;
    approvedByActionId?: string;
    mapViewId?: string;
    transportActionsIds?: string[];
    equipmentActionsIds?: string[];
    explosiveObjectActionsIds?: string[];
    squadLeaderActionId?: string;
    squadActionsIds?: string[];
    explosiveActionsIds?: string[];
}

export const createMissionReportDTO = (value: CreateValue<IMissionReportValueParams>): CreateValue<IMissionReportDTOParams> => ({
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
    explosiveObjectActions: value.explosiveObjectActions.map((el) => createExplosiveObjectActionDTO(el)),
    explosiveActions: value.explosiveActions?.map((el) => createExplosiveActionDTO(el)) ?? [],
    squadLeaderId: value.squadLeaderId,
    squadIds: value.squadIds,
    address: value.address ?? '',
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
    approvedByActionId: value.approvedByAction.id,
    orderId: value.order.id,
    missionRequestId: value.missionRequest?.id,
    mapViewId: value.mapView.id,
    explosiveObjectActionsIds: value.explosiveObjectActions.map((el) => el.id),
    squadLeaderActionId: value.squadLeaderAction.id,
    squadActionsIds: value.squadActions.map((el) => el.id),
    transportActionsIds: value.transportActions.map((el) => el.id),
    equipmentActionsIds: value.equipmentActions.map((el) => el.id),
    explosiveActionsIds: value.explosiveActions.map((el) => el.id),
});

export const createMissionReportSum = (value: IMissionReportSumDTO): IMissionReportSumValue => ({
    total: value.total,
});

export class MissionReportValue implements IMissionReportValue {
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
    addressDetails: IAddressValue;
    createdAt: Dayjs;
    updatedAt: Dayjs;
    orderId?: string;
    missionRequestId?: string;
    approvedByActionId?: string;
    mapViewId?: string;
    transportActionsIds?: string[];
    equipmentActionsIds?: string[];
    explosiveObjectActionsIds?: string[];
    squadLeaderActionId?: string;
    squadActionsIds?: string[];
    explosiveActionsIds?: string[];

    constructor(value: IMissionReportValue) {
        this.id = value.id;
        this.approvedAt = value.approvedAt;
        this.number = value.number;
        this.subNumber = value.subNumber;
        this.executedAt = value.executedAt;
        this.checkedTerritory = value.checkedTerritory;
        this.depthExamination = value.depthExamination;
        this.uncheckedTerritory = value.uncheckedTerritory;
        this.uncheckedReason = value.uncheckedReason;
        this.workStart = value.workStart;
        this.exclusionStart = value.exclusionStart;
        this.transportingStart = value.transportingStart;
        this.destroyedStart = value.destroyedStart;
        this.workEnd = value.workEnd;
        this.address = value.address;
        this.addressDetails = value.addressDetails;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
        this.orderId = value.orderId;
        this.missionRequestId = value.missionRequestId;
        this.approvedByActionId = value.approvedByActionId;
        this.mapViewId = value.mapViewId;
        this.transportActionsIds = value.transportActionsIds;
        this.equipmentActionsIds = value.equipmentActionsIds;
        this.explosiveObjectActionsIds = value.explosiveObjectActionsIds;
        this.squadLeaderActionId = value.squadLeaderActionId;
        this.squadActionsIds = value.squadActionsIds;
        this.explosiveActionsIds = value.explosiveActionsIds;
    }
}
