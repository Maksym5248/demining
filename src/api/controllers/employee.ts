import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { IEmployeeDTO } from '../types'


const add = (value: CreateValue<IEmployeeDTO>):Promise<IEmployeeDTO> => DB.employee.add(value);
const update = (id:string, value: UpdateValue<IEmployeeDTO>):Promise<IEmployeeDTO> => DB.employee.update(id, value);
const remove = (id:string) => DB.employee.remove(id);
const getList = ():Promise<IEmployeeDTO[]> => DB.employee.select();

export const employee = {
	add,
	update,
	remove,
	getList
}