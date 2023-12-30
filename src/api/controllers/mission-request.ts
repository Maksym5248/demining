import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { IMissionRequestDTO } from '../types'

const add = (value: CreateValue<IMissionRequestDTO>):Promise<IMissionRequestDTO> => DB.missionRequest.add(value);
const update = (id:string, value: UpdateValue<IMissionRequestDTO>):Promise<IMissionRequestDTO> => DB.missionRequest.update(id, value);
const remove = (id:string) => DB.missionRequest.remove(id);
const getList = ():Promise<IMissionRequestDTO[]> => DB.missionRequest.select({
	order: {
		by: "number",
		type: "desc",
	}
});

export const missionRequest = {
	add,
	update,
	remove,
	getList
}