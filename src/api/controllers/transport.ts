import { DB, IQuery } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { ITransportDTO } from '../types'


const create = (value: CreateValue<ITransportDTO>):Promise<ITransportDTO> => DB.transport.create(value);
const update = (id:string, value: UpdateValue<ITransportDTO>):Promise<ITransportDTO> => DB.transport.update(id, value);
const remove = (id:string) => DB.transport.remove(id);
const getList = (query?: IQuery):Promise<ITransportDTO[]> => DB.transport.select({
	order: {
		by: "createdAt",
		type: "desc"
	},
	...(query ?? {})
});

export const transport = {
	create,
	update,
	remove,
	getList
}