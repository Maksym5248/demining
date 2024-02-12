import { IWhereQueryOption } from 'jsstore';
import uuid from 'uuid/v4';

import {
	IEmployeeDB, 
	IEmployeeActionDB, 
	IOrderDB,
	IMapViewActionActionDB,
	IMissionReportDB,
	IMissionRequestDB,
	IExplosiveObjectDB,
	IExplosiveObjectTypeDB,
	IExplosiveObjectActionDB,
	ITransportDB,
	ITransportActionDB,
	IEquipmentDB,
	IEquipmentActionDB
} from '../types';

export class DBBase<T extends {id: string}> {
	uuid(){
		return Promise.resolve(uuid());
	}

	select() {
		return Promise.resolve([]);
	}

	get(id:string){
		return Promise.resolve({ id })
	}

	exist():Promise<boolean> {
		return Promise.resolve(false);
	}

	async add(value: Omit<T, "createdAt" | "updatedAt" | "id">){
		const id = await this.uuid();

		return {
			id,
			...value, 
			createdAt: new Date(),
			updatedAt: new Date()
		};
	}

	async initData(values:any){
		return Promise.resolve(values);
	}

	async update(id:string, value: Partial<Omit<T, "createdAt" | "updatedAt" | "id">>){
		const newValue = {...value};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(newValue?.id) delete newValue.id;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(newValue?.updatedAt) delete newValue.updatedAt;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(newValue?.createdAt) delete newValue.createdAt;

		return {
			id,
			...value, 
			createdAt: new Date(),
			updatedAt: new Date()
		};
	}

	async remove(id:string | IWhereQueryOption) {
		return Promise.resolve(id)
	}

	removeBy() {
		return Promise.resolve("removed")
	}
}

export const DB = {
	init: jest.fn(),
	dropDb: () => jest.fn(),
	employee: new DBBase<IEmployeeDB>(),
	employeeAction: new DBBase<IEmployeeActionDB>(),
	mapViewAction: new DBBase<IMapViewActionActionDB>(),
	missionReport: new DBBase<IMissionReportDB>(),
	missionRequest: new DBBase<IMissionRequestDB>(),
	order: new DBBase<IOrderDB>(),
	explosiveObject: new DBBase<IExplosiveObjectDB>(),
	explosiveObjectType: new DBBase<IExplosiveObjectTypeDB>(),
	explosiveObjectAction: new DBBase<IExplosiveObjectActionDB>(),
	transport: new DBBase<ITransportDB>(),
	transportAction: new DBBase<ITransportActionDB>(),
	equipment: new DBBase<IEquipmentDB>(),
	equipmentAction: new DBBase<IEquipmentActionDB>(),
}