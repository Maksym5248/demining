import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { ITransportDTO } from '../types'


const add = (value: CreateValue<ITransportDTO>):Promise<ITransportDTO> => DB.transport.add(value);
const update = (id:string, value: UpdateValue<ITransportDTO>):Promise<ITransportDTO> => DB.transport.update(id, value);
const remove = (id:string) => DB.transport.remove(id);
const getList = ():Promise<ITransportDTO[]> => DB.transport.select();

export const transport = {
	add,
	update,
	remove,
	getList
}