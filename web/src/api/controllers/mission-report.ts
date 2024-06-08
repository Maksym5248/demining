import {
    IEmployeeActionDB,
    IMissionReportDB,
    ILinkedToDocumentDB,
    ITransportActionDB,
    IEquipmentActionDB,
    IExplosiveObjectActionDB,
    IMapViewActionDB,
    IEmployeeDB,
    ITransportDB,
    IEquipmentDB,
    IExplosiveObjectDB,
    IQuery,
    IExplosiveActionDB,
    IExplosiveDB,
} from '@/shared';
import omit from 'lodash/omit';

import { DOCUMENT_TYPE, EMPLOYEE_TYPE } from '~/constants';
import { DB } from '~/db';
import { CreateValue } from '~/types';

import {
    IMissionReportDTO,
    IMissionReportDTOParams,
    IMissionReportPreviewDTO,
    IMissionReportSumDTO,
} from '../types';

interface IItemId {
    id: string;
}

const creatorAction =
    (document: ILinkedToDocumentDB) =>
    <B, T extends IItemId>(sourceValueId: string, merge: Partial<B>, sourceAction: T[]): B => {
        const source = sourceAction.find((el) => el.id === sourceValueId) as T;

        const sourceWithRemovedFields = omit(source, ['id', 'updatedAt', 'createdAt']);

        return {
            ...sourceWithRemovedFields,
            ...merge,
            ...document,
        } as B;
    };

const batchCreateActions = async (actions: INewActions) => {
    if (actions.mapView) DB.mapViewAction.batchCreate(actions.mapView);
    actions.employeesActions.map((el) => DB.employeeAction.batchCreate(el));
    actions.equipmentActions.map((el) => DB.equipmentAction.batchCreate(el));
    actions.transportActions.map((el) => DB.transportAction.batchCreate(el));
    actions.explosiveObjectActions.map((el) => DB.explosiveObjectAction.batchCreate(el));
    actions.explosiveActions.map((el) => DB.explosiveAction.batchCreate(el));
};

const batchRemoveActions = async (actions: IPrevActions) => {
    if (actions.mapView) DB.mapViewAction.batchRemove(actions.mapView.id);
    actions.employeesActions.map((el) => DB.employeeAction.batchRemove(el.id));
    actions.equipmentActions.map((el) => DB.equipmentAction.batchRemove(el.id));
    actions.transportActions.map((el) => DB.transportAction.batchRemove(el.id));
    actions.explosiveObjectActions.map((el) => DB.explosiveObjectAction.batchRemove(el.id));
    actions.explosiveActions.map((el) => DB.explosiveAction.batchRemove(el.id));
};

const batchUpdateActions = async (actions: IPrevActions) => {
    if (actions.mapView) DB.mapViewAction.batchUpdate(actions.mapView.id, actions.mapView);
    actions.employeesActions.map((el) => DB.employeeAction.batchUpdate(el.id, el));
    actions.equipmentActions.map((el) => DB.equipmentAction.batchUpdate(el.id, el));
    actions.transportActions.map((el) => DB.transportAction.batchUpdate(el.id, el));
    actions.explosiveObjectActions.map((el) => DB.explosiveObjectAction.batchUpdate(el.id, el));
    actions.explosiveActions.map((el) => DB.explosiveAction.batchUpdate(el.id, el));
};

export const get = async (id: string): Promise<IMissionReportDTO> => {
    const res = await DB.missionReport.get(id);

    if (!res) {
        throw new Error('there is no missionReport');
    }

    const { missionRequestId, orderId, ...missionReport } = res;

    const query = {
        where: {
            documentId: missionReport.id,
            documentType: DOCUMENT_TYPE.MISSION_REPORT,
        },
    };

    const [
        missionRequest,
        order,
        mapViewActionArr,
        employeesAction,
        transportActions,
        explosiveObjectActions,
        equipmentActions,
        signedByActionOrderArr,
        explosiveActions,
    ] = await Promise.all([
        DB.missionRequest.get(missionRequestId),
        DB.order.get(orderId),
        DB.mapViewAction.select({
            where: {
                documentId: id,
                documentType: DOCUMENT_TYPE.MISSION_REPORT,
            },
            limit: 1,
        }),
        DB.employeeAction.select(query),
        DB.transportAction.select(query),
        DB.explosiveObjectAction.select(query),
        DB.equipmentAction.select(query),
        DB.employeeAction.select({
            where: {
                documentId: orderId,
                documentType: DOCUMENT_TYPE.ORDER,
            },
            limit: 1,
        }),
        DB.explosiveAction.select(query),
    ]);

    const [signedByActionOrder] = signedByActionOrderArr;
    const [mapViewAction] = mapViewActionArr;

    const approvedByAction = employeesAction.find(
        (el) => el.typeInDocument === EMPLOYEE_TYPE.CHIEF,
    );
    const squadLeaderAction = employeesAction.find(
        (el) => el.typeInDocument === EMPLOYEE_TYPE.SQUAD_LEAD,
    );
    const squadActions = employeesAction.filter((el) => el.typeInDocument === EMPLOYEE_TYPE.WORKER);

    if (!order) throw new Error('there is no order');
    if (!signedByActionOrder) throw new Error('there is no signedByActionOrder');
    if (!missionRequest) throw new Error('there is no missionRequest');
    if (!mapViewAction) throw new Error('there is no mapViewAction');
    if (!approvedByAction) throw new Error('there is no approvedByAction');
    if (!squadLeaderAction) throw new Error('there is no squadLeaderAction');

    return {
        ...missionReport,
        order: {
            ...order,
            signedByAction: signedByActionOrder,
        },
        missionRequest,
        mapView: mapViewAction,
        approvedByAction,
        transportActions,
        equipmentActions,
        explosiveObjectActions,
        squadLeaderAction,
        squadActions,
        explosiveActions,
    };
};

const getList = async (query?: IQuery): Promise<IMissionReportPreviewDTO[]> => {
    const list = await DB.missionReport.select({
        order: {
            by: 'createdAt',
            type: 'desc',
        },
        ...(query ?? {}),
    });

    return list.map(({ missionRequestId, orderId, ...rest }) => rest);
};

const remove = async (id: string) => {
    const query = {
        documentId: id,
    };

    await Promise.allSettled([
        DB.missionReport.remove(id),
        DB.mapViewAction.removeBy(query),
        DB.employeeAction.removeBy(query),
        DB.transportAction.removeBy(query),
        DB.explosiveObjectAction.removeBy(query),
        DB.equipmentAction.removeBy(query),
        DB.explosiveAction.removeBy(query),
    ]);
};

interface INewActions {
    mapView?: Omit<IMapViewActionDB, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'geo'> & {
        id?: string;
    };
    employeesActions: (Omit<IEmployeeActionDB, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> & {
        id?: string;
    })[];
    transportActions: (Omit<ITransportActionDB, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> & {
        id?: string;
    })[];
    equipmentActions: (Omit<IEquipmentActionDB, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> & {
        id?: string;
    })[];
    explosiveObjectActions: (Omit<
        IExplosiveObjectActionDB,
        'id' | 'createdAt' | 'updatedAt' | 'authorId'
    > & { id?: string })[];
    explosiveActions: (Omit<IExplosiveActionDB, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> & {
        id?: string;
    })[];
}

interface IPrevActions {
    mapView?: Omit<IMapViewActionDB, 'geo'>;
    employeesActions: IEmployeeActionDB[];
    transportActions: ITransportActionDB[];
    equipmentActions: IEquipmentActionDB[];
    explosiveObjectActions: IExplosiveObjectActionDB[];
    explosiveActions: IExplosiveActionDB[];
}

export interface IRemoveList {
    transportExplosiveObjectActionId?: string;
    transportHumansActionId?: string;
    mineDetectorActionId?: string;
    squadActionIds: string[];
    explosiveObjectActionIds: string[];
    explosiveActionIds: string[];
}

export interface ICreateList {
    transportHumansId?: string;
    transportExplosiveObjectId?: string;
    mineDetectorId?: string;
    squadIds: string[];
    explosiveObjectIds: string[];
    explosiveIds: string[];
}

export const generateActions = async (
    missionReportId: string,
    value: CreateValue<IMissionReportDTOParams>,
): Promise<INewActions> => {
    const {
        approvedById,
        mapView: mapViewValue,
        transportExplosiveObjectId,
        transportHumansId,
        mineDetectorId,
        explosiveObjectActions: explosiveObjectActionsValue,
        squadLeaderId,
        squadIds,
        executedAt,
        explosiveActions: explosiveActionsValue,
    } = value;

    const employeesIds = [approvedById, squadLeaderId, ...squadIds].filter((el) => !!el) ?? [];
    const transportIds = [transportHumansId, transportExplosiveObjectId].filter(
        (el) => !!el,
    ) as string[];
    const explosiveObjectIds =
        explosiveObjectActionsValue.map((el) => el.explosiveObjectId).filter((el) => !!el) ?? [];
    const equipmentIds = ([mineDetectorId].filter((el) => !!el) as string[]) ?? [];
    const explosiveIds =
        explosiveActionsValue?.map((el) => el.explosiveId).filter((el) => !!el) ?? [];

    const [employees, transports, explosiveObjects, equipments, explosives] = await Promise.all([
        employeesIds.length
            ? DB.employee.select({
                  where: {
                      id: { in: employeesIds },
                  },
              })
            : [],
        transportIds.length
            ? DB.transport.select({
                  where: {
                      id: { in: transportIds },
                  },
              })
            : [],
        explosiveObjectIds.length
            ? DB.explosiveObject.select({
                  where: {
                      id: { in: explosiveObjectIds },
                  },
              })
            : [],
        equipmentIds.length
            ? DB.equipment.select({
                  where: {
                      id: { in: equipmentIds },
                  },
              })
            : [],
        explosiveIds.length
            ? DB.explosive.select({
                  where: {
                      id: { in: explosiveIds },
                  },
              })
            : [],
    ]);

    const document: ILinkedToDocumentDB = {
        documentId: missionReportId,
        documentType: DOCUMENT_TYPE.MISSION_REPORT,
        executedAt,
    };

    const createAction = creatorAction(document);

    const mapView = { ...document, ...mapViewValue };
    const approvedByAction = createAction<IEmployeeActionDB, IEmployeeDB>(
        approvedById,
        { employeeId: approvedById, typeInDocument: EMPLOYEE_TYPE.CHIEF },
        employees,
    );
    const squadLeaderAction = createAction<IEmployeeActionDB, IEmployeeDB>(
        squadLeaderId,
        { employeeId: squadLeaderId, typeInDocument: EMPLOYEE_TYPE.SQUAD_LEAD },
        employees,
    );
    const squadActions = squadIds.map((id) =>
        createAction<IEmployeeActionDB, IEmployeeDB>(
            id,
            { employeeId: id, typeInDocument: EMPLOYEE_TYPE.WORKER },
            employees,
        ),
    );

    const employeesActions =
        [approvedByAction, squadLeaderAction, ...squadActions].filter((el) => !!el) ?? [];

    const equipmentActions = equipmentIds.map((id) =>
        createAction<IEquipmentActionDB, IEquipmentDB>(id, { equipmentId: id }, equipments),
    );

    const transportActions = transportIds.map((id) =>
        createAction<ITransportActionDB, ITransportDB>(id, { transportId: id }, transports),
    );

    const explosiveObjectActions = explosiveObjectActionsValue.map((el) =>
        createAction<IExplosiveObjectActionDB, IExplosiveObjectDB>(
            el.explosiveObjectId,
            el,
            explosiveObjects,
        ),
    );

    const explosiveActions =
        explosiveActionsValue?.map((el) =>
            createAction<IExplosiveActionDB, IExplosiveDB>(el.explosiveId, el, explosives),
        ) ?? [];

    return {
        mapView,
        employeesActions,
        transportActions,
        equipmentActions,
        explosiveObjectActions,
        explosiveActions,
    };
};

const getRemovedActions = <T extends B, B extends { id?: string }>(
    prev: T[],
    newB: B[],
    compareId: keyof B,
): T[] => prev.filter((t) => !newB.find((b) => t[compareId] === b[compareId]));
const getCreateActions = <T extends B, B extends { id?: string }>(
    prev: T[],
    newB: B[],
    compareId: keyof B,
): B[] => newB.filter((t) => !prev.find((b) => t[compareId] === b[compareId]));
const getUpdatedActions = <T extends B, B extends { id?: string }>(
    prev: T[],
    newB: B[],
    removeB: T[],
    compareId: keyof B,
): T[] => {
    const needUpdate = prev
        .filter((el) => !removeB.find((r) => r[compareId] === el[compareId]))
        .filter((t) => !!newB.find((b) => t[compareId] === b?.[compareId]));
    return needUpdate.map((t) => ({
        ...t,
        ...newB.find((b) => t[compareId] === b?.[compareId]),
    })) as T[];
};

export const getRemoveList = (
    newActions: INewActions,
    missionReportDTO: IMissionReportDTO,
): IPrevActions => {
    const employeeActions = [
        ...missionReportDTO.squadActions,
        missionReportDTO.approvedByAction,
        missionReportDTO.squadLeaderAction,
    ].filter((el) => !!el);

    return {
        mapView: newActions?.mapView ? undefined : missionReportDTO.mapView,
        employeesActions: getRemovedActions(
            employeeActions,
            newActions.employeesActions,
            'employeeId',
        ),
        transportActions: getRemovedActions(
            missionReportDTO.transportActions,
            newActions.transportActions,
            'transportId',
        ),
        equipmentActions: getRemovedActions(
            missionReportDTO.equipmentActions,
            newActions.equipmentActions,
            'equipmentId',
        ),
        explosiveObjectActions: getRemovedActions(
            missionReportDTO.explosiveObjectActions,
            newActions.explosiveObjectActions,
            'id',
        ),
        explosiveActions: getRemovedActions(
            missionReportDTO.explosiveActions,
            newActions.explosiveActions,
            'id',
        ),
    };
};

export const getCreateList = (
    newActions: INewActions,
    missionReportDTO: IMissionReportDTO,
): INewActions => {
    const employeeActions = [
        ...missionReportDTO.squadActions,
        missionReportDTO.approvedByAction,
        missionReportDTO.squadLeaderAction,
    ].filter((el) => !!el);

    return {
        mapView:
            newActions?.mapView && !missionReportDTO.mapView ? undefined : missionReportDTO.mapView,
        employeesActions: getCreateActions(
            employeeActions,
            newActions.employeesActions,
            'employeeId',
        ),
        transportActions: getCreateActions(
            missionReportDTO.transportActions,
            newActions.transportActions,
            'transportId',
        ),
        equipmentActions: getCreateActions(
            missionReportDTO.equipmentActions,
            newActions.equipmentActions,
            'equipmentId',
        ),
        explosiveObjectActions: getCreateActions(
            missionReportDTO.explosiveObjectActions,
            newActions.explosiveObjectActions,
            'id',
        ),
        explosiveActions: getCreateActions(
            missionReportDTO.explosiveActions,
            newActions.explosiveActions,
            'id',
        ),
    };
};

export const getUpdateList = (
    newActions: INewActions,
    missionReportDTO: IMissionReportDTO,
    removeList: IPrevActions,
): IPrevActions => {
    const employeeActions = [
        ...missionReportDTO.squadActions,
        missionReportDTO.approvedByAction,
        missionReportDTO.squadLeaderAction,
    ].filter((el) => !!el);

    return {
        mapView: {
            ...missionReportDTO.mapView,
            ...newActions.mapView,
        },
        employeesActions: getUpdatedActions(
            employeeActions,
            newActions.employeesActions,
            removeList.employeesActions,
            'employeeId',
        ),
        transportActions: getUpdatedActions(
            missionReportDTO.transportActions,
            newActions.transportActions,
            removeList.transportActions,
            'transportId',
        ),
        equipmentActions: getUpdatedActions(
            missionReportDTO.equipmentActions,
            newActions.equipmentActions,
            removeList.equipmentActions,
            'equipmentId',
        ),
        explosiveObjectActions: getUpdatedActions(
            missionReportDTO.explosiveObjectActions,
            newActions.explosiveObjectActions,
            removeList.explosiveObjectActions,
            'id',
        ),
        explosiveActions: getUpdatedActions(
            missionReportDTO.explosiveActions,
            newActions.explosiveActions,
            removeList.explosiveActions,
            'id',
        ),
    };
};

export const update = async (
    value: CreateValue<IMissionReportDTOParams>,
    missionReportDTO: IMissionReportDTO,
): Promise<IMissionReportDB> => {
    const {
        approvedById,
        mapView,
        transportExplosiveObjectId,
        transportHumansId,
        mineDetectorId,
        squadLeaderId,
        squadIds,
        explosiveObjectActions,
        explosiveActions,
        ...rest
    } = value;

    const actions = await generateActions(missionReportDTO.id, value);

    DB.batchStart();

    const removeList = getRemoveList(actions, missionReportDTO);
    const createList = getCreateList(actions, missionReportDTO);
    const updateList = getUpdateList(actions, missionReportDTO, removeList);

    batchRemoveActions(removeList);
    batchCreateActions(createList);
    batchUpdateActions(updateList);
    DB.missionReport.batchUpdate(missionReportDTO.id, rest);
    await DB.batchCommit();

    const res = await DB.missionReport.get(missionReportDTO.id);

    if (!res) {
        throw new Error('There is no mission report with id');
    }

    return res;
};

export const updateController = async (
    id: string,
    value: CreateValue<IMissionReportDTOParams>,
): Promise<IMissionReportDTO> => {
    const missionReportDTO = await get(id);
    await update(value, missionReportDTO);
    return get(missionReportDTO.id);
};

export const create = async (
    value: CreateValue<IMissionReportDTOParams>,
): Promise<IMissionReportDTO> => {
    const {
        approvedById,
        mapView,
        transportExplosiveObjectId,
        transportHumansId,
        mineDetectorId,
        explosiveObjectActions,
        squadLeaderId,
        squadIds,
        explosiveActions,
        ...rest
    } = value;

    const missionReportData: Omit<
        IMissionReportDB,
        'createdAt' | 'updatedAt' | 'authorId' | 'authorId'
    > = {
        id: DB.missionReport.uuid(),
        ...rest,
    };

    const actions = await generateActions(missionReportData.id, value);

    DB.batchStart();

    batchCreateActions(actions);
    DB.missionReport.batchCreate(missionReportData);

    await DB.batchCommit();

    const res = await get(missionReportData.id);

    return res;
};

const sum = async (query?: IQuery): Promise<IMissionReportSumDTO> => {
    const total = await DB.missionReport.count(query);

    return {
        total,
    };
};

export const missionReport = {
    create,
    update: updateController,
    get,
    remove,
    getList,
    sum,
};
