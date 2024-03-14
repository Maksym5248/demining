import { WriteBatch, getFirestore, writeBatch } from 'firebase/firestore';

import { TABLES, TABLES_DIR } from '~/constants';

import { DBBase } from './db-base';
import {
	IDocumentDB,
	IEmployeeActionDB,
	IEmployeeDB,
	IEquipmentActionDB,
	IEquipmentDB,
	IExplosiveObjectActionDB,
	IExplosiveObjectDB,
	IMapViewActionActionDB,
	IMissionReportDB,
	IMissionRequestDB,
	IOrderDB,
	IOrganizationDB,
	ITransportActionDB,
	ITransportDB,
	IUserDB
} from '../types';

class DBRemoteClass {
	/** COMMON COLLECTIONS */
	user = new DBBase<IUserDB>(TABLES.USER);

	organization = new DBBase<IOrganizationDB>(TABLES.ORGANIZATION);

	explosiveObject = new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT);

	/** ORGANIZATION SUBCOLLECTION */
	employee = new DBBase<IEmployeeDB>(TABLES.EMPLOYEE);

	employeeAction = new DBBase<IEmployeeActionDB>(TABLES.EMPLOYEE_ACTION);

	mapViewAction = new DBBase<IMapViewActionActionDB>(TABLES.MAP_VIEW_ACTION);

	missionReport = new DBBase<IMissionReportDB>(TABLES.MISSION_REPORT);

	missionRequest = new DBBase<IMissionRequestDB>(TABLES.MISSION_REQUEST);

	order = new DBBase<IOrderDB>(TABLES.ORDER);

	explosiveObjectAction = new DBBase<IExplosiveObjectActionDB>(TABLES.EXPLOSIVE_OBJECT_ACTION);

	transport = new DBBase<ITransportDB>(TABLES.TRANSPORT);

	transportAction = new DBBase<ITransportActionDB>(TABLES.TRANSPORT_ACTION);

	equipment = new DBBase<IEquipmentDB>(TABLES.EQUIPMENT);

	equipmentAction = new DBBase<IEquipmentActionDB>(TABLES.EQUIPMENT_ACTION);

	document = new DBBase<IDocumentDB>(TABLES.DOCUMENT);

	batch:WriteBatch | null = null;

	init = () => Promise.resolve();

	dropDb  = () => Promise.resolve();

	setOrganizationId(id:string){
		const rootCollection = `${TABLES_DIR.ORGANIZATION_DATA}/${id}`;

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
		this.document.setRootCollection(rootCollection);
	};

	removeOrganizationId(){
		this.employee.removeRootCollection();
		this.employeeAction.removeRootCollection();
		this.mapViewAction.removeRootCollection();
		this.missionReport.removeRootCollection();
		this.missionRequest.removeRootCollection();
		this.order.removeRootCollection();
		this.explosiveObjectAction.removeRootCollection();
		this.transport.removeRootCollection();
		this.transportAction.removeRootCollection();
		this.equipment.removeRootCollection();
		this.equipmentAction.removeRootCollection();
		this.document.removeRootCollection();
	};

	private setBatch(batch:WriteBatch | null){
		this.batch = batch;
		
		this.user.setBatch(batch);
		this.organization.setBatch(batch);
		this.explosiveObject.setBatch(batch);

		this.employee.setBatch(batch);
		this.employeeAction.setBatch(batch);
		this.mapViewAction.setBatch(batch);
		this.missionReport.setBatch(batch);
		this.missionRequest.setBatch(batch);
		this.order.setBatch(batch);
		this.explosiveObjectAction.setBatch(batch);
		this.transport.setBatch(batch);
		this.transportAction.setBatch(batch);
		this.equipment.setBatch(batch);
		this.equipmentAction.setBatch(batch);
		this.document.setBatch(batch);
	};

	batchStart() {
		const batch = writeBatch(getFirestore());
		this.setBatch(batch);
	}

	async batchCommit () {
		await this.batch?.commit();
		this.setBatch(null);
	}
}


export const DBRemote= new DBRemoteClass();