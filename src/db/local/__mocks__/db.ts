import { IWhereQueryOption } from 'jsstore';

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
} from '../../types';

export class DBBase<T extends {id: string}> {
	uuid = jest.fn(() => Promise.resolve("id"))

	select = jest.fn(() => Promise.resolve([]))

	get = jest.fn((id:string) => Promise.resolve({ id }))

	exist = jest.fn(() => Promise.resolve(false))

	create = jest.fn((value: Omit<T, "createdAt" | "updatedAt" | "id">) => ({
		id: "id",
		...value, 
		createdAt: new Date(),
		updatedAt: new Date()
	}))

	update = jest.fn((id, value: Omit<T, "createdAt" | "updatedAt" | "id">) => {
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
	})

	initData = jest.fn((values:any) => Promise.resolve(values))

	remove = jest.fn((id:string | IWhereQueryOption) => Promise.resolve(id))

	removeBy = jest.fn(() => Promise.resolve("removed"))
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
	explosiveObjectAction: new DBBase<IExplosiveObjectActionDB>(),
	transport: new DBBase<ITransportDB>(),
	transportAction: new DBBase<ITransportActionDB>(),
	equipment: new DBBase<IEquipmentDB>(),
	equipmentAction: new DBBase<IEquipmentActionDB>(),
}