import omit from "lodash/omit";

import { DB, IEmployeeActionDB, IMissionReportDB, ILinkedToDocumentDB,  ITransportActionDB, IEquipmentActionDB, IExplosiveObjectActionDB, IMapViewActionActionDB, IEmployeeDB, ITransportDB, IEquipmentDB, IExplosiveObjectDB } from '~/db'
import { CreateValue } from '~/types'
import { DB_FIELD, DOCUMENT_TYPE, EQUIPMENT_TYPE, TRANSPORT_TYPE } from '~/constants';

import { IMissionReportDTO, IMissionReportDTOParams } from '../types'

interface IItemId {
	id: string
}

const findById = <T extends IItemId>(id: string, data: T[]) => data.find(el => el.id === id) as T;

const creatorAction = (document:ILinkedToDocumentDB) => <B, T extends IItemId>(
	sourceValueId: string,
	merge:Partial<B>,
	sourceAction: T[],
):B => {
	const source = sourceAction.find(el => el.id === sourceValueId) as T;

	const sourceWithRemovedFields = omit(source, ['id', "updatedAt", "createdAt"])
	
	return {
		...document,
		...sourceWithRemovedFields,
		...merge
	} as B
}

export const get = async (id:string): Promise<IMissionReportDTO> => {
	const res = await DB.missionReport.get(id);

	if(!res){
		throw new Error("there is no missionReport")
	}

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
	} = res

	const query = {
		where: {
			documentId: missionReport.id,
		}
	};

	const [
		missionRequest,
		order,
		mapViewAction,
		employeesAction,
		transportActions,
		explosiveObjectsActions,
		equipmentActions
	] = await Promise.all([
		DB.missionRequest.get(missionRequestId),
		DB.order.get(orderId),
		DB.mapViewAction.get(mapViewId),
		DB.employeeAction.select(query),
		DB.transportAction.select(query),
		DB.explosiveObjectAction.select(query),
		DB.equipmentAction.select(query),
	]);

	if(!order){
		throw new Error("there is no order")
	}

	const [explosiveObjectsActionTypes, signedByActionOrder] = await Promise.all([
		DB.explosiveObjectType.select({
			where: {
				id: { in: explosiveObjectsActions.map(el => el.typeId) }
			}
		}),
		DB.employeeAction.get(order.signedByActionId),
	])

	if(!signedByActionOrder) throw new Error("there is no signedByActionOrder");
	if(!missionRequest) throw new Error("there is no missionRequest");
	if(!mapViewAction) throw new Error("there is no mapViewAction");

	return {
		...missionReport,
		order: {
			...order,
			signedByAction: signedByActionOrder
		},
		missionRequest,
		mapView: mapViewAction,
		approvedByAction: findById(approvedByActionId, employeesAction),
		transportActions,
		equipmentActions,
		explosiveObjectActions: explosiveObjectsActions.map(({ typeId, ...value}) => ({
			...value,
			type: findById(typeId, explosiveObjectsActionTypes)
		})),
		squadLeaderAction: findById(squadLeaderActionId, employeesAction),
		squadActions: squadActionIds.map(workerId => findById(workerId, employeesAction))
	}
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

const remove = async (id:string) => {
	const query = {
		documentId: id
	};

	await Promise.allSettled([
		DB.missionReport.remove(id),
		DB.mapViewAction.removeBy(query),
		DB.employeeAction.removeBy(query),
		DB.transportAction.removeBy(query),
		DB.explosiveObjectAction.removeBy(query),
		DB.equipmentAction.removeBy(query),
	]);
};

interface IGenerateActionsParams {
	mapViewValue: Omit<IMapViewActionActionDB, "id" |  "createdAt" | "updatedAt">;
	approvedByAction:IEmployeeActionDB;
	squadLeaderAction: IEmployeeActionDB;
	squadActions: IEmployeeActionDB[];
	transportHumansAction?: ITransportActionDB;
	transportExplosiveObjectAction?: ITransportActionDB;
	mineDetectorAction?: IEquipmentActionDB;
	explosiveObjectsActions: IExplosiveObjectActionDB[];
}

export interface IRemoveList {
	transportExplosiveObjectActionId?: string;
	transportHumansActionId?: string;
	mineDetectorActionId?: string;
	squadActionIds: string[];
	explosiveObjectActionIds: string[];
}

export interface ICreateList {
	transportHumansId?: string;
	transportExplosiveObjectId?: string;
	mineDetectorId?: string;
	squadIds: string[];
	explosiveObjectIds: string[];
}

type IResMissionReportActions = [IEmployeeActionDB[], IExplosiveObjectActionDB[], ITransportActionDB | undefined, ITransportActionDB | undefined, IEmployeeActionDB | undefined]

export const generateActions = async (missionReportId:string, value: CreateValue<IMissionReportDTOParams>):Promise<IGenerateActionsParams> => {
	const {
		approvedById,
		mapView, 
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		explosiveObjectActions,
		squadLeaderId,
		squadIds,
	} = value;

	const [employees, transports, explosiveObjects, equipments] = await Promise.all([
		DB.employee.select({
			where: {
				id: { in: [approvedById, squadLeaderId, ...squadIds] }
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

	const document:ILinkedToDocumentDB = {
		documentId: missionReportId,
		documentType: DOCUMENT_TYPE.MISSION_REPORT
	}

	const createAction = creatorAction(document);

	const mapViewValue = { ...document, ...mapView }
	const approvedByAction = createAction<IEmployeeActionDB, IEmployeeDB>(approvedById, { employeeId: approvedById }, employees);
	const squadLeaderAction = createAction<IEmployeeActionDB, IEmployeeDB>(squadLeaderId, { employeeId: squadLeaderId }, employees);
	const squadActions = squadIds.map(id => createAction<IEmployeeActionDB, IEmployeeDB>(id, { employeeId: id}, employees));

	const transportHumansAction = transportHumansId 
		? createAction<ITransportActionDB, ITransportDB>(transportHumansId, { transportId: transportHumansId}, transports)
		: undefined;

	const transportExplosiveObjectAction = transportExplosiveObjectId 
		? createAction<ITransportActionDB, ITransportDB>(transportExplosiveObjectId, { transportId: transportExplosiveObjectId}, transports)
		: undefined;

	const mineDetectorAction = mineDetectorId 
		? createAction<IEquipmentActionDB, IEquipmentDB>(mineDetectorId, { equipmentId: mineDetectorId}, equipments)
		: undefined;

	const explosiveObjectsActions = explosiveObjectActions.map(el => (
		createAction<IExplosiveObjectActionDB, IExplosiveObjectDB>(el.explosiveObjectId, el, explosiveObjects)
	));

	return {
		mapViewValue,
		approvedByAction,
		squadLeaderAction,
		squadActions,
		transportHumansAction,
		transportExplosiveObjectAction,
		mineDetectorAction,
		explosiveObjectsActions,
	}
};

export const getRemoveList = (
	value: Pick<IMissionReportDTOParams, "transportExplosiveObjectId" | "transportHumansId" | "mineDetectorId" | "squadIds" | "explosiveObjectActions">,
	missionReportDTO:IMissionReportDTO):IRemoveList => {
	const {
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		squadIds,
		explosiveObjectActions,
	} = value;

	const transportHumansActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS) as ITransportActionDB;
	const transportExplosiveObjectActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const mineDetectorActionCurrent = missionReportDTO.equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR) as IEquipmentActionDB;
	const squadCurrent = missionReportDTO.squadActions
	const explosiveObjectActionsCurrent = missionReportDTO.explosiveObjectActions

	return {
		transportExplosiveObjectActionId: transportExplosiveObjectId !== transportExplosiveObjectActionCurrent.transportId
			? transportExplosiveObjectActionCurrent.id
			: undefined,
		transportHumansActionId: transportHumansId !== transportHumansActionCurrent.transportId
			? transportHumansActionCurrent.id
			: undefined,
		mineDetectorActionId: mineDetectorId !== mineDetectorActionCurrent.equipmentId
			? mineDetectorActionCurrent.id
			: undefined,
		squadActionIds: squadCurrent.length
			?  squadCurrent
				.filter(item => !squadIds.includes(item.employeeId))
				.map((el) => el.id)
			: [],
		explosiveObjectActionIds: explosiveObjectActionsCurrent.length
			? explosiveObjectActionsCurrent
				.filter(actionCurrent => !explosiveObjectActions.find(el => el?.id === actionCurrent.id))
				.map((el) => el.id)
			: [],
	}
}

export const getCreateList = (
	value: Pick<IMissionReportDTOParams, "transportExplosiveObjectId" | "transportHumansId" | "mineDetectorId" | "squadIds" | "explosiveObjectActions">,
	missionReportDTO:IMissionReportDTO
):ICreateList => {
	const {
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		squadIds,
		explosiveObjectActions,
	} = value;

	const transportHumansActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS) as ITransportActionDB;
	const transportExplosiveObjectActionCurrent = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const mineDetectorActionCurrent = missionReportDTO.equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR) as IEquipmentActionDB;
	const squadIdsCurrent = missionReportDTO.squadActions.map(el => el.employeeId)
	const explosiveObjectsActionsCurrent = missionReportDTO.explosiveObjectActions

	return {
		transportExplosiveObjectId: transportExplosiveObjectId && transportExplosiveObjectId !== transportExplosiveObjectActionCurrent?.transportId
			? transportExplosiveObjectId
			: undefined,
		transportHumansId: transportHumansId && transportHumansId !== transportHumansActionCurrent?.transportId
			? transportHumansId
			: undefined,
		mineDetectorId: mineDetectorId && mineDetectorId !== mineDetectorActionCurrent?.equipmentId
			? mineDetectorId
			: undefined,
		squadIds: squadIds.length
			? squadIds.filter(workerId => !squadIdsCurrent.includes(workerId))
			: [],
		explosiveObjectIds: explosiveObjectActions.length
			? explosiveObjectActions
				.filter(action => !explosiveObjectsActionsCurrent.find(el => el.id === action?.id))
				.map(el => el.explosiveObjectId)
			: [],
	}
}

export const getUpdatedList = (
	removeList: IRemoveList,
	missionReportDTO:IMissionReportDTO,
) => {
	const transportHumansAction = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS) as ITransportActionDB;
	const transportExplosiveObjectAction = missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS) as ITransportActionDB;
	const mineDetectorAction = missionReportDTO.equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR) as IEquipmentActionDB;
	const workersActionIds = missionReportDTO.squadActions.map(el => el.id)
	const explosiveObjectActionIds = missionReportDTO.explosiveObjectActions.map(el => el.id);

	return {
		transportHumansActionId: removeList.transportHumansActionId !== transportHumansAction.id ? transportHumansAction.id : undefined,
		transportExplosiveObjectActionId: removeList.transportExplosiveObjectActionId !== transportExplosiveObjectAction.id ? transportExplosiveObjectAction.id : undefined,
		mineDetectorActionId: removeList.mineDetectorActionId !== mineDetectorAction.id ? mineDetectorAction.id : undefined,
		squadActionIds: workersActionIds.filter(id => !removeList.squadActionIds.includes(id)),
		explosiveObjectActionsIds:  explosiveObjectActionIds.filter(id => !removeList.explosiveObjectActionIds.includes(id)),
	}
}

export const update = async (value: CreateValue<IMissionReportDTOParams>, missionReportDTO: IMissionReportDTO):Promise<IMissionReportDB> => {
	const {
		approvedById,
		mapView, 
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		squadLeaderId,
		squadIds,
		explosiveObjectActions,
		...rest
	} = value;

	const {
		mapViewValue,
		approvedByAction,
		transportHumansAction,
		transportExplosiveObjectAction,
		mineDetectorAction,
		squadLeaderAction,
		squadActions,
		explosiveObjectsActions,
	} = await generateActions(missionReportDTO.id, value);
	
	const removeList = getRemoveList(value, missionReportDTO);
	const createList = getCreateList(value, missionReportDTO);
	const updateList = getUpdatedList(removeList, missionReportDTO);
				
	const removeListPromises = [
		Promise.all(removeList.squadActionIds.map(id => DB.employeeAction.remove(missionReportDTO.squadActions.find(el => el.employeeId === id)?.id as string))),
		Promise.all(removeList.explosiveObjectActionIds.map(explosiveObjectActionId => DB.explosiveObjectAction.remove(explosiveObjectActionId))),
		removeList.transportHumansActionId ? DB.transportAction.remove(removeList.transportHumansActionId) : undefined,
		removeList.transportExplosiveObjectActionId ? DB.transportAction.remove(removeList.transportExplosiveObjectActionId) : undefined,
		removeList.mineDetectorActionId ? DB.equipment.remove(removeList.mineDetectorActionId) : undefined,
	]
	
	const updateListPromises = [
		Promise.all(updateList.squadActionIds.map((workerId) => DB.employeeAction.get(workerId))),
		Promise.all(updateList.explosiveObjectActionsIds.map(
			explosiveObjectActionId => DB.explosiveObjectAction.update(
				explosiveObjectActionId,
					explosiveObjectsActions.find(el => el.explosiveObjectId === explosiveObjectActionId) as IExplosiveObjectActionDB
			)
		)),
		updateList.transportHumansActionId && transportHumansAction
			  ? DB.transportAction.update(updateList.transportHumansActionId, transportHumansAction)
			  : undefined,
		updateList.transportExplosiveObjectActionId && transportExplosiveObjectAction
			  ? DB.transportAction.update(updateList.transportExplosiveObjectActionId, transportExplosiveObjectAction)
			  : undefined,
		updateList.mineDetectorActionId && mineDetectorAction
			  ? DB.equipmentAction.update(updateList.mineDetectorActionId, mineDetectorAction)
			  : undefined,
	];

	const createListPromises = [
		Promise.all(createList.squadIds.map(id => DB.employeeAction.create(squadActions.find(el => el.employeeId === id) as IEmployeeActionDB))),
		Promise.all(createList.explosiveObjectIds.map(
			explosiveObjectId => DB.explosiveObjectAction.create(
					explosiveObjectsActions.find(el => el.explosiveObjectId === explosiveObjectId) as IExplosiveObjectActionDB
			)
		)),
		createList.transportHumansId && transportHumansAction ? DB.transportAction.create(transportHumansAction) : undefined,
		createList.transportExplosiveObjectId && transportExplosiveObjectAction ? DB.transportAction.create(transportExplosiveObjectAction) : undefined,
		createList.mineDetectorId && mineDetectorAction ? DB.equipmentAction.create(mineDetectorAction) : undefined,
	];
	
	const [
		mapViewDB,
		approvedByActionDB,
		squadLeadActionDB,
		updateDB,
		createDB,
	] = await Promise.all([
		DB.mapViewAction.update(missionReportDTO.mapView.id, mapViewValue),
		DB.employeeAction.update(missionReportDTO.approvedByAction.id, approvedByAction),
		DB.employeeAction.update(missionReportDTO.squadLeaderAction.id, squadLeaderAction),
		Promise.all(updateListPromises),
		Promise.all(createListPromises),
		Promise.all(removeListPromises),
	]);
	
	const [
		createdSquadActions,
		createdExplosiveObjectActions,
		createdTransportHumans,
		createdTransportExplosiveObject,
		createdMineDetector
	] = createDB as IResMissionReportActions;
	
	const [
		updatedSquadActions,
		updatedExplosiveObjectActions,
		updatedTransportHumans,
		updatedTransportExplosiveObject,
		updatedMineDetector
	] = updateDB as IResMissionReportActions;
	
	const data = {
		...rest,
		approvedByActionId: approvedByActionDB.id,
		mapViewId: mapViewDB.id,
		transportActionIds: [
			updatedTransportExplosiveObject?.id,
			updatedTransportHumans?.id,
			createdTransportExplosiveObject?.id,
			createdTransportHumans?.id,
		].filter(el => !!el) as string[],
		equipmentActionIds: [
			updatedMineDetector?.id,
			createdMineDetector?.id,
		].filter(el => !!el) as string[],
		explosiveObjectActionIds: [...updatedExplosiveObjectActions.map(el => el.id), ...createdExplosiveObjectActions.map(el => el.id)],
		squadLeaderActionId: squadLeadActionDB.id,
		squadActionIds: [...updatedSquadActions.map(el => el.id), ...createdSquadActions.map(el => el.id)],
	};

	return DB.missionReport.update(missionReportDTO.id, data);
}

export const updateController = async (id:string, value: CreateValue<IMissionReportDTOParams>):Promise<IMissionReportDTO> => {
	const missionReportDTO  = await get(id);
	await update(value, missionReportDTO)
	return get(missionReportDTO.id);
}

export const create = async (value: CreateValue<IMissionReportDTOParams>):Promise<IMissionReportDTO> => {
	const {
		approvedById,
		mapView, 
		transportExplosiveObjectId,
		transportHumansId,
		mineDetectorId,
		explosiveObjectActions,
		squadLeaderId,
		squadIds,
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
		initialMissionReport  = await DB.missionReport.create(initialMissionReportData)

		const {
			mapViewValue,
			approvedByAction,
			squadLeaderAction,
			squadActions,
			transportHumansAction,
			transportExplosiveObjectAction,
			mineDetectorAction,
			explosiveObjectsActions,
		} = await generateActions(initialMissionReport.id, value)

		const [
			mapViewDB,
			approvedByActionDB,
			squadLeadActionDB,
			squadActionDB, 
			transportHumansActionDB, 
			transportExplosiveObjectActionDB,
			mineDetectorActionDB,
			explosiveObjectsActionsDB
		] = await Promise.all([
			DB.mapViewAction.create(mapViewValue),
			DB.employeeAction.create(approvedByAction),
			DB.employeeAction.create(squadLeaderAction),
			Promise.all(squadActions.map(el  => DB.employeeAction.create(el))),
			transportHumansAction ? DB.transportAction.create(transportHumansAction) : Promise.resolve(undefined),
			transportExplosiveObjectAction ? DB.transportAction.create(transportExplosiveObjectAction) : Promise.resolve(undefined),
			mineDetectorAction ? DB.equipmentAction.create(mineDetectorAction) : Promise.resolve(undefined),
			Promise.all(explosiveObjectsActions.map(el  => DB.explosiveObjectAction.create(el))),
		])

		await DB.missionReport.update(initialMissionReport.id, {
			...rest,
			approvedByActionId: approvedByActionDB.id,
			mapViewId: mapViewDB.id,
			transportActionIds: [transportHumansActionDB?.id, transportExplosiveObjectActionDB?.id].filter(el => !!el) as string[],
			equipmentActionIds: [mineDetectorActionDB?.id].filter(el => !!el) as string[],
			explosiveObjectActionIds: explosiveObjectsActionsDB.map((el) => el.id),
			squadLeaderActionId: squadLeadActionDB.id,
			squadActionIds: squadActionDB.map((el) => el.id),
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

export const missionReport = {
	create,
	update: updateController,
	get,
	remove,
	getList,
}