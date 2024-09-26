import omit from 'lodash/omit';
import { removeFields, DOCUMENT_TYPE, EMPLOYEE_TYPE } from 'shared-my';
import {
    type IEmployeeActionDB,
    type IMissionReportDB,
    type ILinkedToDocumentDB,
    type ITransportActionDB,
    type IEquipmentActionDB,
    type IExplosiveObjectActionDB,
    type IMapViewActionDB,
    type IEmployeeDB,
    type ITransportDB,
    type IEquipmentDB,
    type IExplosiveObjectDB,
    type IExplosiveActionDB,
    type IExplosiveDB,
    type IOrderDB,
    type IMissionRequestDB,
} from 'shared-my';

import { type ICreateValue, type IDBBase, type IQuery } from '~/common';

import { type IMissionReportDTO, type IMissionReportDTOParams, type IMissionReportPreviewDTO, type IMissionReportSumDTO } from '../dto';

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
    explosiveObjectActions: (Omit<IExplosiveObjectActionDB, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> & { id?: string })[];
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

export interface IMissionReportAPI {
    get: (id: string) => Promise<IMissionReportDTO>;
    getList: (query?: IQuery) => Promise<IMissionReportPreviewDTO[]>;
    remove: (id: string) => Promise<void>;
    update: (id: string, value: ICreateValue<IMissionReportDTOParams>) => Promise<IMissionReportDTO>;
    create: (value: ICreateValue<IMissionReportDTOParams>) => Promise<IMissionReportDTO>;
    sum: (query?: IQuery) => Promise<IMissionReportSumDTO>;
}

export class MissionReportAPI implements IMissionReportAPI {
    constructor(
        private db: {
            order: IDBBase<IOrderDB>;
            missionRequest: IDBBase<IMissionRequestDB>;
            missionReport: IDBBase<IMissionReportDB>;
            mapViewAction: IDBBase<IMapViewActionDB>;
            employee: IDBBase<IEmployeeDB>;
            employeeAction: IDBBase<IEmployeeActionDB>;
            transportAction: IDBBase<ITransportActionDB>;
            transport: IDBBase<ITransportDB>;
            explosiveObjectAction: IDBBase<IExplosiveObjectActionDB>;
            explosiveObject: IDBBase<IExplosiveObjectDB>;
            equipmentAction: IDBBase<IEquipmentActionDB>;
            equipment: IDBBase<IEquipmentDB>;
            explosiveAction: IDBBase<IExplosiveActionDB>;
            explosive: IDBBase<IExplosiveDB>;
            batchCommit: () => Promise<void>;
            batchStart: () => void;
        },
    ) {}

    batchCreateActions = async (actions: INewActions) => {
        if (actions.mapView) this.db.mapViewAction.batchCreate(actions.mapView);
        actions.employeesActions.map((el) => this.db.employeeAction.batchCreate(el));
        actions.equipmentActions.map((el) => this.db.equipmentAction.batchCreate(el));
        actions.transportActions.map((el) => this.db.transportAction.batchCreate(el));
        actions.explosiveObjectActions.map((el) => this.db.explosiveObjectAction.batchCreate(el));
        actions.explosiveActions.map((el) => this.db.explosiveAction.batchCreate(el));
    };

    batchRemoveActions = async (actions: IPrevActions) => {
        if (actions.mapView) this.db.mapViewAction.batchRemove(actions.mapView.id);
        actions.employeesActions.map((el) => this.db.employeeAction.batchRemove(el.id));
        actions.equipmentActions.map((el) => this.db.equipmentAction.batchRemove(el.id));
        actions.transportActions.map((el) => this.db.transportAction.batchRemove(el.id));
        actions.explosiveObjectActions.map((el) => this.db.explosiveObjectAction.batchRemove(el.id));
        actions.explosiveActions.map((el) => this.db.explosiveAction.batchRemove(el.id));
    };

    batchUpdateActions = async (actions: IPrevActions) => {
        if (actions.mapView) this.db.mapViewAction.batchUpdate(actions.mapView.id, actions.mapView);
        actions.employeesActions.map((el) => this.db.employeeAction.batchUpdate(el.id, el));
        actions.equipmentActions.map((el) => this.db.equipmentAction.batchUpdate(el.id, el));
        actions.transportActions.map((el) => this.db.transportAction.batchUpdate(el.id, el));
        actions.explosiveObjectActions.map((el) => this.db.explosiveObjectAction.batchUpdate(el.id, el));
        actions.explosiveActions.map((el) => this.db.explosiveAction.batchUpdate(el.id, el));
    };

    get = async (id: string): Promise<IMissionReportDTO> => {
        const missionReport = await this.db.missionReport.get(id);

        if (!missionReport) {
            throw new Error('there is no missionReport');
        }

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
            this.db.missionRequest.get(missionReport.missionRequestId),
            this.db.order.get(missionReport.orderId),
            this.db.mapViewAction.select({
                where: {
                    documentId: id,
                    documentType: DOCUMENT_TYPE.MISSION_REPORT,
                },
                limit: 1,
            }),
            this.db.employeeAction.select(query),
            this.db.transportAction.select(query),
            this.db.explosiveObjectAction.select(query),
            this.db.equipmentAction.select(query),
            this.db.employeeAction.select({
                where: {
                    documentId: missionReport.orderId,
                    documentType: DOCUMENT_TYPE.ORDER,
                },
                limit: 1,
            }),
            this.db.explosiveAction.select(query),
        ]);

        const [signedByActionOrder] = signedByActionOrderArr;
        const [mapViewAction] = mapViewActionArr;

        const approvedByAction = employeesAction.find((el) => el.typeInDocument === EMPLOYEE_TYPE.CHIEF);
        const squadLeaderAction = employeesAction.find((el) => el.typeInDocument === EMPLOYEE_TYPE.SQUAD_LEAD);
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

    getList = async (query?: IQuery): Promise<IMissionReportPreviewDTO[]> => {
        const list = await this.db.missionReport.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

        return list;
    };

    remove = async (id: string) => {
        const query = {
            documentId: id,
        };

        await Promise.allSettled([
            this.db.missionReport.remove(id),
            this.db.mapViewAction.removeBy(query),
            this.db.employeeAction.removeBy(query),
            this.db.transportAction.removeBy(query),
            this.db.explosiveObjectAction.removeBy(query),
            this.db.equipmentAction.removeBy(query),
            this.db.explosiveAction.removeBy(query),
        ]);
    };

    generateActions = async (missionReportId: string, value: ICreateValue<IMissionReportDTOParams>): Promise<INewActions> => {
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
        const transportIds = [transportHumansId, transportExplosiveObjectId].filter((el) => !!el) as string[];
        const explosiveObjectIds = explosiveObjectActionsValue.map((el) => el.explosiveObjectId).filter((el) => !!el) ?? [];
        const equipmentIds = ([mineDetectorId].filter((el) => !!el) as string[]) ?? [];
        const explosiveIds = explosiveActionsValue?.map((el) => el.explosiveId).filter((el) => !!el) ?? [];

        const [employees, transports, explosiveObjects, equipments, explosives] = await Promise.all([
            employeesIds.length
                ? this.db.employee.select({
                      where: {
                          id: { in: employeesIds },
                      },
                  })
                : [],
            transportIds.length
                ? this.db.transport.select({
                      where: {
                          id: { in: transportIds },
                      },
                  })
                : [],
            explosiveObjectIds.length
                ? this.db.explosiveObject.select({
                      where: {
                          id: { in: explosiveObjectIds },
                      },
                  })
                : [],
            equipmentIds.length
                ? this.db.equipment.select({
                      where: {
                          id: { in: equipmentIds },
                      },
                  })
                : [],
            explosiveIds.length
                ? this.db.explosive.select({
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
            createAction<IEmployeeActionDB, IEmployeeDB>(id, { employeeId: id, typeInDocument: EMPLOYEE_TYPE.WORKER }, employees),
        );

        const employeesActions = [approvedByAction, squadLeaderAction, ...squadActions].filter((el) => !!el) ?? [];

        const equipmentActions = equipmentIds.map((id) =>
            createAction<IEquipmentActionDB, IEquipmentDB>(id, { equipmentId: id }, equipments),
        );

        const transportActions = transportIds.map((id) =>
            createAction<ITransportActionDB, ITransportDB>(id, { transportId: id }, transports),
        );

        const explosiveObjectActions = explosiveObjectActionsValue.map((el) =>
            createAction<IExplosiveObjectActionDB, IExplosiveObjectDB>(el.explosiveObjectId, el, explosiveObjects),
        );

        const explosiveActions =
            explosiveActionsValue?.map((el) => createAction<IExplosiveActionDB, IExplosiveDB>(el.explosiveId, el, explosives)) ?? [];

        return {
            mapView,
            employeesActions,
            transportActions,
            equipmentActions,
            explosiveObjectActions,
            explosiveActions,
        };
    };

    getRemovedActions = <T extends B, B extends { id?: string }>(prev: T[], newB: B[], compareId: keyof B): T[] =>
        prev.filter((t) => !newB.find((b) => t[compareId] === b[compareId]));
    getCreateActions = <T extends B, B extends { id?: string }>(prev: T[], newB: B[], compareId: keyof B): B[] =>
        newB.filter((t) => !prev.find((b) => t[compareId] === b[compareId]));
    getUpdatedActions = <T extends B, B extends { id?: string }>(prev: T[], newB: B[], removeB: T[], compareId: keyof B): T[] => {
        const needUpdate = prev
            .filter((el) => !removeB.find((r) => r[compareId] === el[compareId]))
            .filter((t) => !!newB.find((b) => t[compareId] === b?.[compareId]));
        return needUpdate.map((t) => ({
            ...t,
            ...newB.find((b) => t[compareId] === b?.[compareId]),
        })) as T[];
    };

    getRemoveList = (newActions: INewActions, missionReportDTO: IMissionReportDTO): IPrevActions => {
        const employeeActions = [
            ...missionReportDTO.squadActions,
            missionReportDTO.approvedByAction,
            missionReportDTO.squadLeaderAction,
        ].filter((el) => !!el);

        return {
            mapView: newActions?.mapView ? undefined : missionReportDTO.mapView,
            employeesActions: this.getRemovedActions(employeeActions, newActions.employeesActions, 'employeeId'),
            transportActions: this.getRemovedActions(missionReportDTO.transportActions, newActions.transportActions, 'transportId'),
            equipmentActions: this.getRemovedActions(missionReportDTO.equipmentActions, newActions.equipmentActions, 'equipmentId'),
            explosiveObjectActions: this.getRemovedActions(
                missionReportDTO.explosiveObjectActions,
                newActions.explosiveObjectActions,
                'id',
            ),
            explosiveActions: this.getRemovedActions(missionReportDTO.explosiveActions, newActions.explosiveActions, 'id'),
        };
    };

    getCreateList = (newActions: INewActions, missionReportDTO: IMissionReportDTO): INewActions => {
        const employeeActions = [
            ...missionReportDTO.squadActions,
            missionReportDTO.approvedByAction,
            missionReportDTO.squadLeaderAction,
        ].filter((el) => !!el);

        return {
            mapView: newActions?.mapView && !missionReportDTO.mapView ? undefined : missionReportDTO.mapView,
            employeesActions: this.getCreateActions(employeeActions, newActions.employeesActions, 'employeeId'),
            transportActions: this.getCreateActions(missionReportDTO.transportActions, newActions.transportActions, 'transportId'),
            equipmentActions: this.getCreateActions(missionReportDTO.equipmentActions, newActions.equipmentActions, 'equipmentId'),
            explosiveObjectActions: this.getCreateActions(missionReportDTO.explosiveObjectActions, newActions.explosiveObjectActions, 'id'),
            explosiveActions: this.getCreateActions(missionReportDTO.explosiveActions, newActions.explosiveActions, 'id'),
        };
    };

    getUpdateList = (newActions: INewActions, missionReportDTO: IMissionReportDTO, removeList: IPrevActions): IPrevActions => {
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
            employeesActions: this.getUpdatedActions(
                employeeActions,
                newActions.employeesActions,
                removeList.employeesActions,
                'employeeId',
            ),
            transportActions: this.getUpdatedActions(
                missionReportDTO.transportActions,
                newActions.transportActions,
                removeList.transportActions,
                'transportId',
            ),
            equipmentActions: this.getUpdatedActions(
                missionReportDTO.equipmentActions,
                newActions.equipmentActions,
                removeList.equipmentActions,
                'equipmentId',
            ),
            explosiveObjectActions: this.getUpdatedActions(
                missionReportDTO.explosiveObjectActions,
                newActions.explosiveObjectActions,
                removeList.explosiveObjectActions,
                'id',
            ),
            explosiveActions: this.getUpdatedActions(
                missionReportDTO.explosiveActions,
                newActions.explosiveActions,
                removeList.explosiveActions,
                'id',
            ),
        };
    };

    updateController = async (
        value: ICreateValue<IMissionReportDTOParams>,
        missionReportDTO: IMissionReportDTO,
    ): Promise<IMissionReportDB> => {
        const newValue = { ...value };

        removeFields(newValue, [
            'approvedById',
            'mapView',
            'transportExplosiveObjectId',
            'transportHumansId',
            'mineDetectorId',
            'squadLeaderId',
            'squadIds',
            'explosiveObjectActions',
            'explosiveActions',
        ]);

        const actions = await this.generateActions(missionReportDTO.id, value);

        this.db.batchStart();

        const removeList = this.getRemoveList(actions, missionReportDTO);
        const createList = this.getCreateList(actions, missionReportDTO);
        const updateList = this.getUpdateList(actions, missionReportDTO, removeList);

        this.batchRemoveActions(removeList);
        this.batchCreateActions(createList);
        this.batchUpdateActions(updateList);
        this.db.missionReport.batchUpdate(missionReportDTO.id, newValue);
        await this.db.batchCommit();

        const res = await this.db.missionReport.get(missionReportDTO.id);

        if (!res) {
            throw new Error('There is no mission report with id');
        }

        return res;
    };

    update = async (id: string, value: ICreateValue<IMissionReportDTOParams>): Promise<IMissionReportDTO> => {
        const missionReportDTO = await this.get(id);
        await this.updateController(value, missionReportDTO);
        return this.get(missionReportDTO.id);
    };

    create = async (value: ICreateValue<IMissionReportDTOParams>): Promise<IMissionReportDTO> => {
        const newValue = { ...value };

        removeFields(newValue, [
            'approvedById',
            'mapView',
            'transportExplosiveObjectId',
            'transportHumansId',
            'mineDetectorId',
            'squadLeaderId',
            'squadIds',
            'explosiveObjectActions',
            'explosiveActions',
        ]);

        const missionReportData: Omit<IMissionReportDB, 'createdAt' | 'updatedAt' | 'authorId' | 'authorId'> = {
            id: this.db.missionReport.uuid(),
            ...newValue,
        };

        const actions = await this.generateActions(missionReportData.id, value);

        this.db.batchStart();

        this.batchCreateActions(actions);
        this.db.missionReport.batchCreate(missionReportData);

        await this.db.batchCommit();

        const res = await this.get(missionReportData.id);

        return res;
    };

    sum = async (query?: IQuery): Promise<IMissionReportSumDTO> => {
        const total = await this.db.missionReport.count(query);

        return {
            total,
        };
    };
}
