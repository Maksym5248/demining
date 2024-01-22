import { DB, IEmployeeActionDB, IMissionReportDB, ILinkedToDocumentDB,  ITransportActionDB, IEquipmentActionDB, IExplosiveObjectActionDB, IMapViewActionActionDB } from '~/db'
import { CreateValue } from '~/types'
import { DB_FIELD, DOCUMENT_TYPE } from '~/constants';

import { IMissionReportDTO, IMissionReportDTOParams } from '../types'

interface IItemId {
	id: string
}

const removeFields = <T extends IItemId>(field: keyof T, item: T) => {
	const newItem = { ...item };
	delete item[field]
	return newItem;
}

const findById = <T extends IItemId>(id: string, data: T[]) => data.find(el => el.id === id) as T;

const get = async (id:string): Promise<IMissionReportDTO> => {
	const {
		missionRequestId,
		orderId,
		mapViewId,
		approvedByActionId,
		transportActionIds,
		equipmentActionIds,
		explosiveObjectActionIds,
		squadLeaderActionId,
		squadActionIds,
		...missionReport
	} = await DB.missionReport.get(id);

	const [
		missionRequest,
		order,
		mapViewAction,
		employeesAction,
		transportsAction,
		explosiveObjectsAction,
		equipmentsAction
	] = await Promise.all([
		DB.missionRequest.get(missionRequestId),
		DB.order.get(orderId),
		DB.mapViewAction.get(mapViewId),
		DB.employeeAction.select({
			where: {
				documentId: missionReport.id,
			}
		}),
		DB.transportAction.select({
			where: {
				documentId: missionReport.id,
			}
		}),
		DB.explosiveObjectAction.select({
			where: {
				documentId: missionReport.id,
			}
		}),
		DB.equipmentAction.select({
			where: {
				documentId: missionReport.id,
			}
		}),
	]);

	const [explosiveObjectsActionTypes, signedByActionOrder] = await Promise.all([
		DB.explosiveObjectType.select({
			where: {
				id: { in: explosiveObjectsAction.map(el => el.typeId) }
			}
		}),
		DB.employeeAction.get(order.signedByActionId),
	])

	return {
		...missionReport,
		order: {
			...order,
			signedByAction: signedByActionOrder
		},
		missionRequest,
		mapView: mapViewAction,
		approvedByAction: findById(approvedByActionId, employeesAction),
		transportActions: transportsAction,
		equipmentActions: equipmentsAction,
		explosiveObjectActions: explosiveObjectsAction.map(({ typeId, ...value}) => ({
			...value,
			type: findById(typeId, explosiveObjectsActionTypes)
		})),
		squadLeaderAction: findById(squadLeaderActionId, employeesAction),
		squadActions: squadActionIds.map(workerId => findById(workerId, employeesAction))
	}
};

const add = async (value: CreateValue<IMissionReportDTOParams>):Promise<IMissionReportDTO> => {
	const {
		approvedById,
		mapView, 
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		explosiveObjectActions,
		squadLeadId,
		workersIds,
		...rest
	} = value;

	const initialMissionReportData: Omit<IMissionReportDB, "id" |  "createdAt" | "updatedAt"> = {
		...rest,
		approvedByActionId: DB_FIELD.NONE,
		mapViewId: DB_FIELD.NONE,
		transportActionIds: [DB_FIELD.NONE],
		equipmentActionIds: [DB_FIELD.NONE],
		explosiveObjectActionIds: [DB_FIELD.NONE],
		squadLeaderActionId: DB_FIELD.NONE,
		squadActionIds: [DB_FIELD.NONE],
	}

	let initialMissionReport;
	
	let mapViewValue: Omit<IMapViewActionActionDB, "id" |  "createdAt" | "updatedAt">;
	let approvedByAction:IEmployeeActionDB;
	let squadLeadAction: IEmployeeActionDB;
	let squadActionIds: IEmployeeActionDB[];
	let transportHumansAction: ITransportActionDB;
	let transportExplosiveObjectAction: ITransportActionDB;
	let mineDetectorAction: IEquipmentActionDB;
	let explosiveObjectsActions: IExplosiveObjectActionDB[];

	try {
		initialMissionReport  = await DB.missionReport.add(initialMissionReportData)

		const document:ILinkedToDocumentDB = {
			documentId: initialMissionReport.id,
			documentType: DOCUMENT_TYPE.MISSION_REPORT
		}

		const [employees, transports, explosiveObjects, equipments] = await Promise.all([
			DB.employee.select({
				where: {
					id: { in: [approvedById, squadLeadId, ...workersIds] }
				}
			}),
			DB.transport.select({
				where: {
					id: { in: [transportHumansId, transportExplosiveObjectId].filter(el => !!el) }
				}
			}),
			DB.explosiveObject.select({
				where: {
					id: { in: explosiveObjectActions.map(el => el.explosiveObjectId) }
				}
			}),
			DB.equipment.select({
				where: {
					id: { in: [mineDetectorId] }
				}
			}),
		]);

		mapViewValue = {
			...document,
			...mapView,
		}

		const approvedBy = removeFields("id", findById(approvedById, employees));
		approvedByAction = {
			...document,
			...approvedBy,
			employeeId: approvedById,
		}

		const squadLead = removeFields("id", findById(squadLeadId, employees));
		squadLeadAction = {
			...document,
			...squadLead,
			employeeId: squadLeadId,
		}


		squadActionIds = workersIds.map(workerId => {
			const employee = removeFields("id", findById(workerId, employees));
			return {
				...document,
				...employee,
				employeeId: squadLeadId,
			}
		});

		const transportHumans = removeFields("id", findById(transportHumansId, transports));
		transportHumansAction = {
			...document,
			...transportHumans,
			transportId: transportHumansId
		}

		const transportExplosiveObject = removeFields("id", findById(transportExplosiveObjectId, transports));
		transportExplosiveObjectAction = {
			...document,
			...transportExplosiveObject,
			transportId: transportHumansId
		}

		const mineDetector = removeFields("id", findById(mineDetectorId, equipments));
		mineDetectorAction = {
			...document,
			...mineDetector,
			equipmentId: mineDetectorId
		}

		explosiveObjectsActions = explosiveObjectActions.map(explosiveObjectAction => {
			const explosiveObject = removeFields("id", findById(explosiveObjectAction.explosiveObjectId, explosiveObjects));
			return {
				...document,
				...explosiveObject,
				...explosiveObjectAction,
			}
		});

		const [
			mapViewDB,
			approvedByActionDB,
			squadLeadActionDB,
			squadActionIdsDB, 
			transportHumansActionDB, 
			transportExplosiveObjectActionDB,
			mineDetectorActionDB,
			explosiveObjectsActionsDB
		] = await Promise.all([
			DB.mapViewAction.add(mapViewValue),
			DB.employeeAction.add(approvedByAction),
			DB.employeeAction.add(squadLeadAction),
			Promise.all(squadActionIds.map(el  => DB.employeeAction.add(el))),
			DB.transportAction.add(transportHumansAction),
			DB.transportAction.add(transportExplosiveObjectAction),
			DB.equipmentAction.add(mineDetectorAction),
			Promise.all(explosiveObjectsActions.map(el  => DB.explosiveObjectAction.add(el))),
		])

		await DB.missionReport.update(initialMissionReport.id, {
			...rest,
			approvedByActionId: approvedByActionDB.id,
			mapViewId: mapViewDB.id,
			transportActionIds: [transportHumansActionDB.id, transportExplosiveObjectActionDB.id],
			equipmentActionIds: [mineDetectorActionDB.id],
			explosiveObjectActionIds: explosiveObjectsActionsDB.map((el) => el.id),
			squadLeaderActionId: squadLeadActionDB.id,
			squadActionIds: squadActionIdsDB.map((el) => el.id),
		});
	} catch (e) {
		if(initialMissionReport){
			await Promise.allSettled([
				DB.missionReport.remove(initialMissionReport.id),
				DB.employee.removeBy({
					documentId: initialMissionReport.id
				}),
				DB.transport.removeBy({
					documentId: initialMissionReport.id
				}),
				DB.explosiveObject.removeBy({
					documentId: initialMissionReport.id
				}),
				DB.equipment.removeBy({
					documentId: initialMissionReport.id
				}),
			]);
		}

		throw e;
	}

	const missionReport = await get(initialMissionReport.id);

	return missionReport;
};

const getList = async ():Promise<IMissionReportDTO[]> => {
	const list = await DB.missionReport.select({
		order: {
			by: "number",
			type: "desc",
		}
	});

	const res = await Promise.all(list.map(el => get(el.id)));

	return res;
};

export const missionReport = {
	add,
	get,
	getList,
}