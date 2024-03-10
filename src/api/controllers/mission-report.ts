import omit from "lodash/omit";

import { DB, IEmployeeActionDB, IMissionReportDB, ILinkedToDocumentDB,  ITransportActionDB, IEquipmentActionDB, IExplosiveObjectActionDB, IMapViewActionActionDB, IEmployeeDB, ITransportDB, IEquipmentDB, IExplosiveObjectDB } from '~/db'
import { CreateValue } from '~/types'
import { DOCUMENT_TYPE, EMPLOYEE_TYPE, EQUIPMENT_TYPE, TRANSPORT_TYPE } from '~/constants';

import { IMissionReportDTO, IMissionReportDTOParams, IMissionReportPreviewDTO } from '../types'

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

	const { missionRequestId, orderId, ...missionReport } = res

	const query = {
		where: {
			documentId: missionReport.id,
		}
	};

	const [
		missionRequest,
		order,
		mapViewActionArr,
		employeesAction,
		transportActions,
		explosiveObjectsActions,
		equipmentActions,
		signedByActionOrderArr
	] = await Promise.all([
		DB.missionRequest.get(missionRequestId),
		DB.order.get(orderId),
		DB.mapViewAction.select({
			where: {
				documentId: id,
				documentType: DOCUMENT_TYPE.MISSION_REPORT
			},
			limit: 1
		}),
		DB.employeeAction.select(query),
		DB.transportAction.select(query),
		DB.explosiveObjectAction.select(query),
		DB.equipmentAction.select(query),
		DB.employeeAction.select({
			where: {
				documentId: orderId,
				documentType: DOCUMENT_TYPE.ORDER
			},
			limit: 1
		}),
	]);

	const [signedByActionOrder] = signedByActionOrderArr;
	const [mapViewAction] = mapViewActionArr;

	const approvedByAction = employeesAction.find(el => el.typeInDocument === EMPLOYEE_TYPE.CHIEF);
	const squadLeaderAction = employeesAction.find(el => el.typeInDocument === EMPLOYEE_TYPE.SQUAD_LEAD);
	const squadActions = employeesAction.filter(el => el.typeInDocument === EMPLOYEE_TYPE.WORKER);

	if(!order) throw new Error("there is no order")
	if(!signedByActionOrder) throw new Error("there is no signedByActionOrder");
	if(!missionRequest) throw new Error("there is no missionRequest");
	if(!mapViewAction) throw new Error("there is no mapViewAction");
	if(!approvedByAction) throw new Error("there is no approvedByAction");
	if(!squadLeaderAction) throw new Error("there is no squadLeaderAction");

	const explosiveObjectsActionTypes = await DB.explosiveObjectType.select({
		where: {
			id: { in: explosiveObjectsActions.map(el => el.typeId) }
		}
	});

	return {
		...missionReport,
		order: {
			...order,
			signedByAction: signedByActionOrder
		},
		missionRequest,
		mapView: mapViewAction,
		approvedByAction,
		transportActions,
		equipmentActions,
		explosiveObjectActions: explosiveObjectsActions.map(({ typeId, ...value}) => ({
			...value,
			type: findById(typeId, explosiveObjectsActionTypes)
		})),
		squadLeaderAction,
		squadActions,
	}
};

const getList = async ():Promise<IMissionReportPreviewDTO[]> => {
	const list = await DB.missionReport.select({
		order: {
			by: "number",
			type: "desc",
		}
	});

	return list.map(({ missionRequestId, orderId, ...rest }) => rest);
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
	const approvedByAction = createAction<IEmployeeActionDB, IEmployeeDB>(approvedById, { employeeId: approvedById, typeInDocument: EMPLOYEE_TYPE.CHIEF }, employees);
	const squadLeaderAction = createAction<IEmployeeActionDB, IEmployeeDB>(squadLeaderId, { employeeId: squadLeaderId, typeInDocument: EMPLOYEE_TYPE.SQUAD_LEAD }, employees);
	const squadActions = squadIds.map(id => createAction<IEmployeeActionDB, IEmployeeDB>(id, { employeeId: id,  typeInDocument: EMPLOYEE_TYPE.WORKER }, employees));

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
	
	const [data] = await Promise.all([
		DB.missionReport.update(missionReportDTO.id, rest),
		DB.mapViewAction.update(missionReportDTO.mapView.id, mapViewValue),
		DB.employeeAction.update(missionReportDTO.approvedByAction.id, approvedByAction),
		DB.employeeAction.update(missionReportDTO.squadLeaderAction.id, squadLeaderAction),
		Promise.all(updateListPromises),
		Promise.all(createListPromises),
		Promise.all(removeListPromises),
	]);
	
	return data;
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

	const missionReportData: Omit<IMissionReportDB, "createdAt" | "updatedAt"> = {
		id: DB.missionReport.uuid(),
		...rest,
	}
	
	try {
		const {
			mapViewValue,
			approvedByAction,
			squadLeaderAction,
			squadActions,
			transportHumansAction,
			transportExplosiveObjectAction,
			mineDetectorAction,
			explosiveObjectsActions,
		} = await generateActions(missionReportData.id, value)

		await Promise.all([
			DB.mapViewAction.create(mapViewValue),
			DB.employeeAction.create(approvedByAction),
			DB.employeeAction.create(squadLeaderAction),
			Promise.all(squadActions.map(el  => DB.employeeAction.create(el))),
			transportHumansAction ? DB.transportAction.create(transportHumansAction) : Promise.resolve(undefined),
			transportExplosiveObjectAction ? DB.transportAction.create(transportExplosiveObjectAction) : Promise.resolve(undefined),
			mineDetectorAction ? DB.equipmentAction.create(mineDetectorAction) : Promise.resolve(undefined),
			Promise.all(explosiveObjectsActions.map(el  => DB.explosiveObjectAction.create(el))),
			await DB.missionReport.create(missionReportData)
		]);

		const res = await get(missionReportData.id);

		return res;
	} catch (e) {
		if(missionReportData){
			await remove(missionReportData.id);
		}

		throw e;
	}

};

export const missionReport = {
	create,
	update: updateController,
	get,
	remove,
	getList,
}