import { IQuery } from '@/shared'

import { DB } from '~/db';
import { UpdateValue, CreateValue } from '~/types'

import { IEmployeeDTO } from '../types'


const create = (value: CreateValue<IEmployeeDTO>):Promise<IEmployeeDTO> => DB.employee.create(value);
const update = (id:string, value: UpdateValue<IEmployeeDTO>):Promise<IEmployeeDTO> => DB.employee.update(id, value);
const remove = (id:string) => DB.employee.remove(id);
const getList = (query?: IQuery):Promise<IEmployeeDTO[]> => DB.employee.select({
	order: {
		by: "createdAt",
		type: "desc"
	},
	...(query ?? {})
});

const get = async (id:string):Promise<IEmployeeDTO> => {
	const res = await DB.employee.get(id);
	if(!res) throw new Error("there is employee with id");
	return res;
}

export const employee = {
	create,
	update,
	remove,
	getList,
	get
}