import { removeFields } from 'shared-my/common';
import { dates } from 'shared-my-client/common';
import { type IEmployee, type IMissionReport, type IMissionRequest, type IOrder, createAddress } from 'shared-my-client/stores';

import { MAP_ZOOM } from '~/constants';

function removeId<T extends { id?: string }>(item: T) {
    return removeFields(item, 'id');
}

export const createCopyValue = (currentMissionReport: IMissionReport) => ({
    approvedAt: currentMissionReport.data.approvedAt,
    approvedById: currentMissionReport.data.approvedByActionId ?? '',
    number: currentMissionReport.data.number,
    subNumber: currentMissionReport.data?.subNumber,
    executedAt: currentMissionReport.data?.executedAt,
    orderId: currentMissionReport.data.orderId,
    missionRequestId: currentMissionReport.data.missionRequestId,
    checkedTerritory: currentMissionReport.data.checkedTerritory,
    depthExamination: currentMissionReport.data.depthExamination,
    uncheckedTerritory: currentMissionReport.data.uncheckedTerritory,
    uncheckedReason: currentMissionReport.data.uncheckedReason,
    workStart: currentMissionReport.data.workStart,
    exclusionStart: currentMissionReport.data.exclusionStart,
    transportingStart: currentMissionReport.data.transportingStart,
    destroyedStart: currentMissionReport.data.destroyedStart,
    workEnd: currentMissionReport?.data.workEnd,
    transportExplosiveObjectId: currentMissionReport?.transportExplosiveObject?.data?.transportId,
    transportHumansId: currentMissionReport?.transportHumans?.data?.transportId,
    mineDetectorId: currentMissionReport?.mineDetector?.data?.equipmentId,
    explosiveObjectActions: currentMissionReport?.explosiveObjectActions.map((el) => el.data).map(removeId) ?? [],
    explosiveActions: currentMissionReport?.explosiveActions.map((el) => el.data).map(removeId) ?? [],
    squadLeaderId: currentMissionReport?.squadLeaderAction?.data?.employeeId,
    squadIds: currentMissionReport?.squadActions.map((el) => el.data?.employeeId) ?? [],
    address: currentMissionReport?.data?.address,
    addressDetails: currentMissionReport?.data?.addressDetails,
    mapView: removeId(currentMissionReport?.mapView.data),
});

export const createEditValue = (currentMissionReport?: IMissionReport | null) => ({
    approvedAt: currentMissionReport?.data?.approvedAt,
    approvedById: currentMissionReport?.approvedByAction?.data?.employeeId,
    number: currentMissionReport?.data?.number,
    subNumber: currentMissionReport?.data?.subNumber,
    executedAt: currentMissionReport?.data?.executedAt,
    orderId: currentMissionReport?.order?.data?.id,
    missionRequestId: currentMissionReport?.missionRequest?.data?.id,
    checkedTerritory: currentMissionReport?.data?.checkedTerritory,
    depthExamination: currentMissionReport?.data?.depthExamination,
    uncheckedTerritory: currentMissionReport?.data?.uncheckedTerritory,
    uncheckedReason: currentMissionReport?.data?.uncheckedReason,
    workStart: currentMissionReport?.data?.workStart,
    exclusionStart: currentMissionReport?.data?.exclusionStart,
    transportingStart: currentMissionReport?.data?.transportingStart,
    destroyedStart: currentMissionReport?.data?.destroyedStart,
    workEnd: currentMissionReport?.data?.workEnd,
    transportExplosiveObjectId: currentMissionReport?.transportExplosiveObject?.data?.transportId,
    transportHumansId: currentMissionReport?.transportHumans?.data?.transportId,
    mineDetectorId: currentMissionReport?.mineDetector?.data?.equipmentId,
    explosiveObjectActions: currentMissionReport?.explosiveObjectActions.map((el) => el.data) ?? [],
    explosiveActions: currentMissionReport?.explosiveActions.map((el) => el.data) ?? [],
    squadLeaderId: currentMissionReport?.squadLeaderAction?.data?.employeeId,
    squadIds: currentMissionReport?.squadActions.map((el) => el.data?.employeeId) ?? [],
    address: currentMissionReport?.data?.address,
    addressDetails: currentMissionReport?.data?.addressDetails,
    mapView: currentMissionReport?.mapView?.data,
});

export const createCreateValue = (
    chiefFirst?: IEmployee,
    firstMissionReport?: IMissionReport,
    firstOrder?: IOrder,
    firstMissionRequest?: IMissionRequest,
    firstSquadLeader?: IEmployee,
) => ({
    approvedAt: dates.today(),
    approvedById: chiefFirst?.data?.id,
    number: firstMissionReport?.data?.subNumber ? firstMissionReport?.data?.number : (firstMissionReport?.data?.number ?? 0) + 1,
    subNumber: firstMissionReport?.data?.subNumber ? (firstMissionReport?.data?.subNumber ?? 0) + 1 : undefined,
    executedAt: dates.today(),
    orderId: firstOrder?.data?.id,
    missionRequestId: firstMissionRequest?.data?.id,
    checkedTerritory: undefined,
    depthExamination: undefined,
    uncheckedTerritory: undefined,
    uncheckedReason: undefined,
    workStart: undefined,
    exclusionStart: undefined,
    transportingStart: undefined,
    destroyedStart: undefined,
    workEnd: undefined,
    transportExplosiveObjectId: undefined,
    transportHumansId: undefined,
    mineDetectorId: undefined,
    explosiveObjectActions: [],
    explosiveActions: [],
    squadLeaderId: firstSquadLeader?.data?.id,
    squadIds: [],
    address: '',
    addressDetails: createAddress(),
    mapView: {
        zoom: MAP_ZOOM.DEFAULT,
    },
});
