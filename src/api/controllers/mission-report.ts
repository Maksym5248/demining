import { DB, IEmployeeActionDB, IMissionReportDB, ILinkedToDocumentDB,  ITransportActionDB, IEquipmentActionDB, IExplosiveObjectActionDB, IMapViewActionActionDB } from '~/db'
import { CreateValue } from '~/types'
import { DB_FIELD, DOCUMENT_TYPE, EQUIPMENT_TYPE, TRANSPORT_TYPE } from '~/constants';

import { IMissionReportDTO, IMissionReportDTOParams } from '../types'

interface IItemId {
	id: string
}

const removeFields = <T extends IItemId>(field: keyof T, item: T) => {
	const newItem = { ...item };
	delete newItem[field]
	return newItem;
}

const findById = <T extends IItemId>(id: string, data: T[]) => data.find(el => el.id === id) as T;

const remove = async (id:string) => {
	await Promise.allSettled([
		DB.missionReport.remove(id),
		DB.mapViewAction.removeBy({
			documentId: id
		}),
		DB.employeeAction.removeBy({
			documentId: id
		}),
		DB.transportAction.removeBy({
			documentId: id
		}),
		DB.explosiveObjectAction.removeBy({
			documentId: id
		}),
		DB.equipmentAction.removeBy({
			documentId: id
		}),
	]);
};

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

const generateActions = async (missionReportId:string, value: CreateValue<IMissionReportDTOParams>):Promise<{
	mapViewValue: Omit<IMapViewActionActionDB, "id" |  "createdAt" | "updatedAt">;
	approvedByAction:IEmployeeActionDB;
	squadLeadAction: IEmployeeActionDB;
	squadActionIds: IEmployeeActionDB[];
	transportHumansAction: ITransportActionDB;
	transportExplosiveObjectAction: ITransportActionDB;
	mineDetectorAction: IEquipmentActionDB;
	explosiveObjectsActions: IExplosiveObjectActionDB[];
}> => {
	const {
		approvedById,
		mapView, 
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		explosiveObjectActions,
		squadLeadId,
		workersIds,
	} = value;

	const document:ILinkedToDocumentDB = {
		documentId: missionReportId,
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

	const mapViewValue = {
		...document,
		...mapView,
	}

	const approvedBy = removeFields("id", findById(approvedById, employees));
	const approvedByAction = {
		...document,
		...approvedBy,
		employeeId: approvedById,
	}

	const squadLead = removeFields("id", findById(squadLeadId, employees));
	const squadLeadAction = {
		...document,
		...squadLead,
		employeeId: squadLeadId,
	}

	const squadActionIds = workersIds.map(workerId => {
		const employee = removeFields("id", findById(workerId, employees));
		return {
			...document,
			...employee,
			employeeId: employee.id,
		}
	});

	const transportHumans = removeFields("id", findById(transportHumansId, transports));
	const transportHumansAction = {
		...document,
		...transportHumans,
		transportId: transportHumansId
	}

	const transportExplosiveObject = removeFields("id", findById(transportExplosiveObjectId, transports));
	const transportExplosiveObjectAction = {
		...document,
		...transportExplosiveObject,
		transportId: transportExplosiveObjectId
	}

	const mineDetector = removeFields("id", findById(mineDetectorId, equipments));
	const mineDetectorAction = {
		...document,
		...mineDetector,
		equipmentId: mineDetectorId
	}

	const explosiveObjectsActions = explosiveObjectActions.map(explosiveObjectAction => {
		const explosiveObject = removeFields("id", findById(explosiveObjectAction.explosiveObjectId, explosiveObjects));
		return {
			...document,
			...explosiveObject,
			...explosiveObjectAction,
		}
	});


	return {
		mapViewValue,
		approvedByAction,
		squadLeadAction,
		squadActionIds,
		transportHumansAction,
		transportExplosiveObjectAction,
		mineDetectorAction,
		explosiveObjectsActions,
	}
};


const getRemoveList = (value: CreateValue<IMissionReportDTOParams>, missionReportDTO:IMissionReportDTO) => {
	const {
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		workersIds,
		explosiveObjectActions,
	} = value;

	const transportHumansActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const transportExplosiveObjectActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const mineDetectorActionCurrent = missionReportDTO.equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR) as IEquipmentActionDB;
	const workersIdsCurrent = missionReportDTO.squadActions.map(el => el.employeeId)
	const explosiveObjectIdsCurrent = missionReportDTO.explosiveObjectActions.map(el => el.explosiveObjectId)

	return {
		transportExplosiveObjectActionId: !transportExplosiveObjectId && transportExplosiveObjectActionCurrent.id
			? transportExplosiveObjectActionCurrent.id
			: undefined,
		transportHumansActionId: !transportHumansId && transportHumansActionCurrent.id
			?transportHumansActionCurrent.id
			: undefined,
		mineDetectorActionId: !mineDetectorId && mineDetectorActionCurrent.id
			? mineDetectorActionCurrent.id
			: undefined,
		workersActionIds: workersIdsCurrent.length
			?  workersIdsCurrent
				.filter(workerIdCurrent => !workersIds.includes(workerIdCurrent))
				.map((_, i) => missionReportDTO.squadActions[i].id)
			: [],
		explosiveObjectActionIds:explosiveObjectIdsCurrent.length
			? explosiveObjectIdsCurrent
				.filter(actionCurrent => !explosiveObjectActions.find(action => action.explosiveObjectId === actionCurrent))
				.map((_, i) => missionReportDTO.explosiveObjectActions[i].id)
			: [],
	}
}

const getCreateList = (value: CreateValue<IMissionReportDTOParams>, missionReportDTO:IMissionReportDTO) => {
	const {
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		workersIds,
		explosiveObjectActions,
	} = value;

	const transportHumansActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS) as ITransportActionDB;
	const transportExplosiveObjectActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const mineDetectorActionCurrent = missionReportDTO.equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR) as IEquipmentActionDB;
	const workersIdsCurrent = missionReportDTO.squadActions.map(el => el.employeeId)
	const explosiveObjectIdsCurrent = missionReportDTO.explosiveObjectActions.map(el => el.explosiveObjectId)

	return {
		transportExplosiveObjectId: transportExplosiveObjectId && transportExplosiveObjectId !== transportExplosiveObjectActionCurrent.transportId
			? transportExplosiveObjectId
			: undefined,
		transportHumansId: transportHumansId && transportHumansId !== transportHumansActionCurrent.transportId
			? transportHumansId
			: undefined,
		mineDetectorId: mineDetectorId && mineDetectorId !== mineDetectorActionCurrent.equipmentId
			? mineDetectorId
			: undefined,
		workersIds: workersIds.length
			? workersIds.filter(workerId => !workersIdsCurrent.includes(workerId))
			: [],
		explosiveObjectIds: explosiveObjectActions.length
			? explosiveObjectActions.filter(action => !explosiveObjectIdsCurrent.includes(action.explosiveObjectId))
			: [],
	}
}

const update = async (id:string, value: CreateValue<IMissionReportDTOParams>):Promise<IMissionReportDTO> => {
	const {
		approvedById,
		mapView, 
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		squadLeadId,
		workersIds,
		explosiveObjectActions,
		...rest
	} = value;

	const missionReportDTO  = await get(id);

	const transportHumansActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const transportExplosiveObjectActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const mineDetectorActionCurrent = missionReportDTO.equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR) as IEquipmentActionDB;
	const workersActionIdsCurrent = missionReportDTO.squadActions.map(el => el.id)
	const explosiveObjectActionIdsCurrent = missionReportDTO.explosiveObjectActions.map(el => el.id);

	const {
		mapViewValue,
		approvedByAction,
		transportHumansAction,
		transportExplosiveObjectAction,
		mineDetectorAction,
		squadLeadAction,
		squadActionIds,
		explosiveObjectsActions,
	} = await generateActions(missionReportDTO.id, value);

	const removeList = getRemoveList(value, missionReportDTO);
	const createList = getCreateList(value, missionReportDTO);
	const updateList = {
		transportHumansId:!createList.transportHumansId && !removeList.transportHumansActionId && transportHumansId
			? transportHumansActionCurrent.id
			: undefined,
		 transportExplosiveObjectId: !createList.transportExplosiveObjectId && !removeList.transportExplosiveObjectActionId && transportExplosiveObjectId
			? transportExplosiveObjectActionCurrent.id
			: undefined,
		mineDetectorId: !createList.mineDetectorId && !removeList.mineDetectorActionId && mineDetectorId
			? mineDetectorActionCurrent.id
			: undefined,
		workersActionIds: workersIds.length
			? workersActionIdsCurrent
				.filter(workerId => !removeList.workersActionIds.includes(workerId))
			: [],
		explosiveObjectActionsIds: explosiveObjectActions.length
			? explosiveObjectActionIdsCurrent
				.filter(explosiveObjectId => !removeList.explosiveObjectActionIds.includes(explosiveObjectId))
			: [],
	};

		
	const removeListPromises = [
		Promise.all(removeList.workersActionIds.map(workersId => DB.employeeAction.remove(missionReportDTO.squadActions.find(el => el.employeeId === workersId)?.id as string))),
		Promise.all(removeList.explosiveObjectActionIds.map(explosiveObjectActionId => DB.explosiveObjectAction.remove(explosiveObjectActionId))),
		removeList.transportHumansActionId ? DB.transportAction.remove(removeList.transportHumansActionId) : undefined,
		removeList.transportExplosiveObjectActionId ? DB.transportAction.remove(removeList.transportExplosiveObjectActionId) : undefined,
		removeList.mineDetectorActionId ? DB.equipment.remove(removeList.mineDetectorActionId) : undefined,
	]

	const createListPromises = [
		Promise.all(createList.workersIds.map(workersId => DB.employeeAction.add(squadActionIds.find(el => el.employeeId === workersId) as IEmployeeActionDB))),
		Promise.all(createList.explosiveObjectIds.map(
			explosiveObjectId => DB.explosiveObjectAction.add(
				explosiveObjectsActions.find(el => el === explosiveObjectId) as IExplosiveObjectActionDB
			)
		)),
		createList.transportHumansId ? DB.transportAction.add(transportHumansAction) : undefined,
		createList.transportExplosiveObjectId ? DB.transportAction.add(transportExplosiveObjectAction) : undefined,
		createList.mineDetectorId ? DB.equipmentAction.add(mineDetectorAction) : undefined,
	];

	const updateListPromises = [
		Promise.all(updateList.workersActionIds.map((workerId) => DB.employeeAction.get(workerId))),
		Promise.all(updateList.explosiveObjectActionsIds.map(
			explosiveObjectActionId => DB.explosiveObjectAction.update(
				explosiveObjectActionId,
				explosiveObjectsActions.find(el => el.explosiveObjectId === explosiveObjectActionId) as IExplosiveObjectActionDB
			)
		)),
		updateList.transportHumansId
		  ? DB.transportAction.update(updateList.transportHumansId, transportHumansAction)
		  : undefined,
		updateList.transportExplosiveObjectId 
		  ? DB.transportAction.update(transportExplosiveObjectActionCurrent.id, transportExplosiveObjectAction)
		  : undefined,
		updateList.mineDetectorId
		  ? DB.equipmentAction.update(mineDetectorActionCurrent.id, mineDetectorAction)
		  : undefined,
	];

	const [
		mapViewDB,
		approvedByActionDB,
		squadLeadActionDB,
		createDB,
		updateDB,
	] = await Promise.all([
		DB.mapViewAction.update(missionReportDTO.mapView.id, mapViewValue),
		DB.employeeAction.update(missionReportDTO.approvedByAction.id, approvedByAction),
		DB.employeeAction.update(missionReportDTO.squadLeaderAction.id, squadLeadAction),
		Promise.all(createListPromises),
		Promise.all(updateListPromises),
		Promise.all(removeListPromises),
	]);


	const [
		createSquadActions,
		createExplosiveObjectActions
	] = createDB as [IEmployeeActionDB[], IExplosiveObjectActionDB[]];

	const [
		updateSquadActions,
		updatedExplosiveObjectActions
	] = updateDB as [IEmployeeActionDB[],IExplosiveObjectActionDB[]];

	const data = {
		...rest,
		approvedByActionId: approvedByActionDB.id,
		mapViewId: mapViewDB.id,
		transportActionIds: [
			updateList.transportExplosiveObjectId,
			createList.transportExplosiveObjectId,
			updateList.transportHumansId,
			createList.transportHumansId
		].filter(el => !!el) as string[],
		equipmentActionIds: [
			updateList.mineDetectorId,
			createList.mineDetectorId,
		].filter(el => !!el) as string[],
		explosiveObjectActionIds: [...updatedExplosiveObjectActions.map(el => el.id), ...createExplosiveObjectActions.map(el => el.id)],
		squadLeaderActionId: squadLeadActionDB.id,
		squadActionIds: [...updateSquadActions.map(el => el.id), ...createSquadActions.map(el => el.id)],
	};
	DB.missionReport.update(missionReportDTO.id, data);

	return get(missionReportDTO.id);
}

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
	
	try {
		initialMissionReport  = await DB.missionReport.add(initialMissionReportData)

		const {
			mapViewValue,
			approvedByAction,
			squadLeadAction,
			squadActionIds,
			transportHumansAction,
			transportExplosiveObjectAction,
			mineDetectorAction,
			explosiveObjectsActions,
		} = await generateActions(initialMissionReport.id, value)

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
			await remove(initialMissionReport.id);
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
	update,
	get,
	remove,
	getList,
}