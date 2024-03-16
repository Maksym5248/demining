import omit from "lodash/omit";

import { DB, IEmployeeActionDB, IMissionReportDB, ILinkedToDocumentDB,  ITransportActionDB, IEquipmentActionDB, IExplosiveObjectActionDB, IMapViewActionActionDB, IEmployeeDB, ITransportDB, IEquipmentDB, IExplosiveObjectDB, IQuery } from '~/db'
import { CreateValue } from '~/types'
import { DOCUMENT_TYPE, EMPLOYEE_TYPE, EQUIPMENT_TYPE, TRANSPORT_TYPE } from '~/constants';

import { IMissionReportDTO, IMissionReportDTOParams, IMissionReportPreviewDTO } from '../types'

interface IItemId {
	id: string
}

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
		explosiveObjectActions,
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
		explosiveObjectActions,
		squadLeaderAction,
		squadActions,
	}
};

const getList = async (query?: IQuery):Promise<IMissionReportPreviewDTO[]> => {
	const list = await DB.missionReport.select({
		order: {
			by: "createdAt",
			type: "desc"
		},
		...(query ?? {})
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
	
	DB.batchStart();

	const removeList = getRemoveList(value, missionReportDTO);
	const createList = getCreateList(value, missionReportDTO);
	const updateList = getUpdatedList(removeList, missionReportDTO);
				
	removeList.squadActionIds.map(id => DB.employeeAction.batchRemove(missionReportDTO.squadActions.find(el => el.employeeId === id)?.id as string));
	removeList.explosiveObjectActionIds.map(explosiveObjectActionId => DB.explosiveObjectAction.batchRemove(explosiveObjectActionId));
	if(removeList.transportHumansActionId) DB.transportAction.batchRemove(removeList.transportHumansActionId);
	if(removeList.transportExplosiveObjectActionId )DB.transportAction.batchRemove(removeList.transportExplosiveObjectActionId);
	if(removeList.mineDetectorActionId) DB.equipment.batchRemove(removeList.mineDetectorActionId);
	
	updateList.squadActionIds.map((workerId) => DB.employeeAction.get(workerId));
	updateList.explosiveObjectActionsIds.map(
		explosiveObjectActionId => DB.explosiveObjectAction.batchUpdate(
			explosiveObjectActionId,
					explosiveObjectsActions.find(el => el.explosiveObjectId === explosiveObjectActionId) as IExplosiveObjectActionDB
		)
	);
	if(updateList.transportHumansActionId && transportHumansAction)
		DB.transportAction.batchUpdate(updateList.transportHumansActionId, transportHumansAction);
	if(updateList.transportExplosiveObjectActionId && transportExplosiveObjectAction)
		DB.transportAction.batchUpdate(updateList.transportExplosiveObjectActionId, transportExplosiveObjectAction);
	if(updateList.mineDetectorActionId && mineDetectorAction)
			   DB.equipmentAction.batchUpdate(updateList.mineDetectorActionId, mineDetectorAction);

	createList.squadIds.map(id => DB.employeeAction.batchCreate(squadActions.find(el => el.employeeId === id) as IEmployeeActionDB));
	createList.explosiveObjectIds.map(
		explosiveObjectId => DB.explosiveObjectAction.batchCreate(
					explosiveObjectsActions.find(el => el.explosiveObjectId === explosiveObjectId) as IExplosiveObjectActionDB
		)
	);
	if(createList.transportHumansId && transportHumansAction) DB.transportAction.batchCreate(transportHumansAction);
	if(createList.transportExplosiveObjectId && transportExplosiveObjectAction) DB.transportAction.batchCreate(transportExplosiveObjectAction);
	if(createList.mineDetectorId && mineDetectorAction) DB.equipmentAction.batchCreate(mineDetectorAction);
	
	DB.missionReport.batchUpdate(missionReportDTO.id, rest);
	DB.mapViewAction.batchUpdate(missionReportDTO.mapView.id, mapViewValue);
	DB.employeeAction.batchUpdate(missionReportDTO.approvedByAction.id, approvedByAction);
	DB.employeeAction.batchUpdate(missionReportDTO.squadLeaderAction.id, squadLeaderAction);
		
	await DB.batchCommit();

	const res = await DB.missionReport.get(missionReportDTO.id);

	if(!res){
		throw new Error("There is no mission report with id")
	}

	return res;
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

		DB.batchStart();

		DB.mapViewAction.batchCreate(mapViewValue);
		DB.employeeAction.batchCreate(approvedByAction);
		DB.employeeAction.batchCreate(squadLeaderAction);
		squadActions.map(el  => DB.employeeAction.batchCreate(el));
		if(transportHumansAction) DB.transportAction.batchCreate(transportHumansAction);
		if(transportExplosiveObjectAction) DB.transportAction.batchCreate(transportExplosiveObjectAction);
		if(mineDetectorAction) DB.equipmentAction.batchCreate(mineDetectorAction);
		explosiveObjectsActions.map(el  => DB.explosiveObjectAction.batchCreate(el));
		DB.missionReport.batchCreate(missionReportData);

		await DB.batchCommit();

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