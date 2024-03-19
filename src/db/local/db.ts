import { IDataBase } from 'jsstore';

import { TABLES } from '~/constants';
import { CONFIG } from '~/config';

import { DBBase } from './db-base';
import { DBInit } from './db-init';
import {
	schemaEmployee,
	schemaOrder,
	schemaMapViewAction,
	schemaMissionReport,
	schemaMissionRequest,
	schemaEmployeeAction,
	schemaExplosiveObject,
	schemaExplosiveObjectAction,
	schemaEquipment,
	schemaEquipmentAction,
	schemaTransport,
	schemaTransportAction
} from './schema';
import {
	IEmployeeDB, 
	IEmployeeActionDB, 
	IOrderDB,
	IMapViewActionActionDB,
	IMissionReportDB,
	IMissionRequestDB,
	IExplosiveObjectDB,
	IExplosiveObjectActionDB,
	ITransportDB,
	ITransportActionDB,
	IEquipmentDB,
	IEquipmentActionDB
} from '../types';

const getSchema = ():IDataBase => ({
	name: CONFIG.DB_NAME,
	version: 1,
	tables: [
		schemaEmployee,
		schemaEmployeeAction,
		schemaOrder,
		schemaMapViewAction,
		schemaMissionReport,
		schemaMissionRequest,
		schemaExplosiveObject,
		schemaExplosiveObjectAction,
		schemaEquipment,
		schemaEquipmentAction,
		schemaTransport,
		schemaTransportAction
	]
} as IDataBase)

export const DB = {
	init: () => DBInit.init(getSchema()),
	dropDb: () => DBInit.dropDb(),
	employee: new DBBase<IEmployeeDB>(DBInit.getDB(), TABLES.EMPLOYEE),
	employeeAction: new DBBase<IEmployeeActionDB>(DBInit.getDB(), TABLES.EMPLOYEE_ACTION),
	mapViewAction: new DBBase<IMapViewActionActionDB>(DBInit.getDB(), TABLES.MAP_VIEW_ACTION),
	missionReport: new DBBase<IMissionReportDB>(DBInit.getDB(), TABLES.MISSION_REPORT),
	missionRequest: new DBBase<IMissionRequestDB>(DBInit.getDB(), TABLES.MISSION_REQUEST),
	order: new DBBase<IOrderDB>(DBInit.getDB(), TABLES.ORDER),
	explosiveObject: new DBBase<IExplosiveObjectDB>(DBInit.getDB(), TABLES.EXPLOSIVE_OBJECT),
	explosiveObjectAction: new DBBase<IExplosiveObjectActionDB>(DBInit.getDB(), TABLES.EXPLOSIVE_OBJECT_ACTION),
	transport: new DBBase<ITransportDB>(DBInit.getDB(), TABLES.TRANSPORT),
	transportAction: new DBBase<ITransportActionDB>(DBInit.getDB(), TABLES.TRANSPORT_ACTION),
	equipment: new DBBase<IEquipmentDB>(DBInit.getDB(), TABLES.EQUIPMENT),
	equipmentAction: new DBBase<IEquipmentActionDB>(DBInit.getDB(), TABLES.EQUIPMENT_ACTION),
}