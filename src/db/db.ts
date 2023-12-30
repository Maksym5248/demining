import { IDataBase } from 'jsstore';

import { TABLES } from '~/constants';
import { CONFIG } from '~/config';

import { DBBase } from './db-base';
import { DBInit } from './db-init';
import {
	schemaEmployee,
	schemaOrder, 
	schemaMissionRequest,
	schemaEmployeeHistory,
	schemaExplosiveObject,
	schemaExplosiveObjectType,
	schemaExplosiveObjectHistory,
	schemaEquipment,
	schemaEquipmentHistory,
	schemaTransport,
	schemaTransportHistory
} from './schema';
import {
	IEmployeeDB, 
	IEmployeeHistoryDB, 
	IOrderDB,
	IMissionRequestDB,
	IExplosiveObjectDB,
	IExplosiveObjectTypeDB,
	IExplosiveObjectHistoryDB,
	ITransportDB,
	ITransportHistoryDB,
	IEquipmentDB,
	IEquipmentHistoryDB
} from './types';

const getSchema = ():IDataBase => ({
	name: CONFIG.DB_NAME,
	version: 1,
	tables: [
		schemaEmployee,
		schemaEmployeeHistory,
		schemaOrder,
		schemaMissionRequest,
		schemaExplosiveObject,
		schemaExplosiveObjectType,
		schemaExplosiveObjectHistory,
		schemaEquipment,
		schemaEquipmentHistory,
		schemaTransport,
		schemaTransportHistory
	]
} as IDataBase)

export const DB = {
	init: () => DBInit.init(getSchema()),
	dropDb: () => DBInit.dropDb(),
	employee: new DBBase<IEmployeeDB>(DBInit.getDB(), TABLES.EMPLOYEE),
	employeeHistory: new DBBase<IEmployeeHistoryDB>(DBInit.getDB(), TABLES.EMPLOYEE_HISTORY),
	missionRequest: new DBBase<IMissionRequestDB>(DBInit.getDB(), TABLES.MISSION_REQUEST),
	order: new DBBase<IOrderDB>(DBInit.getDB(), TABLES.ORDER),
	explosiveObject: new DBBase<IExplosiveObjectDB>(DBInit.getDB(), TABLES.EXPLOSIVE_OBJECT),
	explosiveObjectType: new DBBase<IExplosiveObjectTypeDB>(DBInit.getDB(), TABLES.EXPLOSIVE_OBJECT_TYPE),
	explosiveObjectHistory: new DBBase<IExplosiveObjectHistoryDB>(DBInit.getDB(), TABLES.EXPLOSIVE_OBJECT_HISTORY),
	transport: new DBBase<ITransportDB>(DBInit.getDB(), TABLES.TRANSPORT),
	transportHistory: new DBBase<ITransportHistoryDB>(DBInit.getDB(), TABLES.TRANSPORT_HISTORY),
	equipment: new DBBase<IEquipmentDB>(DBInit.getDB(), TABLES.EQUIPMENT),
	equipmentHistory: new DBBase<IEquipmentHistoryDB>(DBInit.getDB(), TABLES.EQUIPMENT_HISTORY),
}