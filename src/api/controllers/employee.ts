import { DB, IQuery } from '~/db'
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

export const employee = {
	create,
	update,
	remove,
	getList
}