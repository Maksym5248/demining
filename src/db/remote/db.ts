import { TABLES } from '~/constants';

import { DBBase } from './db-base';
import {
	IEmployeeActionDB,
	IEmployeeDB,
	IEquipmentActionDB,
	IEquipmentDB,
	IExplosiveObjectActionDB,
	IExplosiveObjectDB,
	IExplosiveObjectTypeDB,
	IMapViewActionActionDB,
	IMissionReportDB,
	IMissionRequestDB,
	IOrderDB,
	IOrganizationDB,
	ITransportActionDB,
	ITransportDB,
	IUserDB
} from '../types';

const init  = () => Promise.resolve();
const dropDb = () => Promise.resolve();

export const DBRemote = {
	init,
	dropDb,
	setRootCollection(id:string){
		const rootCollection = `${TABLES.ORGANIZATION_DATA}/${id}`;
		this.employee.setRootCollection(rootCollection);
		this.employeeAction.setRootCollection(rootCollection);
		this.mapViewAction.setRootCollection(rootCollection);
		this.missionReport.setRootCollection(rootCollection);
		this.missionRequest.setRootCollection(rootCollection);
		this.order.setRootCollection(rootCollection);
		this.explosiveObjectAction.setRootCollection(rootCollection);
		this.transport.setRootCollection(rootCollection);
		this.transportAction.setRootCollection(rootCollection);
		this.equipment.setRootCollection(rootCollection);
		this.equipmentAction.setRootCollection(rootCollection);
	},
	/** COMMON COLLECTIONS */
	user: new DBBase<IUserDB>(TABLES.USER),
	organization: new DBBase<IOrganizationDB>(TABLES.ORGANIZATION),
	explosiveObject: new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT),
	explosiveObjectType: new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE),

	/** ORGANIZATION SUBCOLLECTION */
	employee: new DBBase<IEmployeeDB>(TABLES.EMPLOYEE),
	employeeAction: new DBBase<IEmployeeActionDB>(TABLES.EMPLOYEE_ACTION),
	mapViewAction: new DBBase<IMapViewActionActionDB>(TABLES.MAP_VIEW_ACTION),
	missionReport: new DBBase<IMissionReportDB>(TABLES.MISSION_REPORT),
	missionRequest: new DBBase<IMissionRequestDB>(TABLES.MISSION_REQUEST),
	order: new DBBase<IOrderDB>(TABLES.ORDER),
	explosiveObjectAction: new DBBase<IExplosiveObjectActionDB>(TABLES.EXPLOSIVE_OBJECT_ACTION),
	transport: new DBBase<ITransportDB>(TABLES.TRANSPORT),
	transportAction: new DBBase<ITransportActionDB>(TABLES.TRANSPORT_ACTION),
	equipment: new DBBase<IEquipmentDB>(TABLES.EQUIPMENT),
	equipmentAction: new DBBase<IEquipmentActionDB>(TABLES.EQUIPMENT_ACTION),
}