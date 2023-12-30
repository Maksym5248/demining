import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { IEquipmentDTO } from '../types'

const add = (value: CreateValue<IEquipmentDTO>):Promise<IEquipmentDTO> => DB.equipment.add(value);
const update = (id:string, value: UpdateValue<IEquipmentDTO>):Promise<IEquipmentDTO> => DB.equipment.update(id, value);
const remove = (id:string) => DB.equipment.remove(id);
const getList = ():Promise<IEquipmentDTO[]> => DB.equipment.select();

export const equipment = {
	add,
	update,
	remove,
	getList
}