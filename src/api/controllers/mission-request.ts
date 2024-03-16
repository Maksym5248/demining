import { DB, IQuery } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { IMissionRequestDTO } from '../types'

const create = (value: CreateValue<IMissionRequestDTO>):Promise<IMissionRequestDTO> => DB.missionRequest.create(value);
const update = (id:string, value: UpdateValue<IMissionRequestDTO>):Promise<IMissionRequestDTO> => DB.missionRequest.update(id, value);
const remove = (id:string) => DB.missionRequest.remove(id);
const getList = (query?: IQuery):Promise<IMissionRequestDTO[]> => DB.missionRequest.select({
	order: {
		by: "createdAt",
		type: "desc"
	},
	...(query ?? {})
});

export const missionRequest = {
	create,
	update,
	remove,
	getList
}