import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'
import { ERRORS } from '~/constants'

import { IExplosiveObjectTypeDTO } from '../types'
import {explosiveObjectTypes } from '../data'

const create = (value: CreateValue<IExplosiveObjectTypeDTO>):Promise<IExplosiveObjectTypeDTO> => DB.explosiveObjectType.create(value);
const update = (id:string, value: UpdateValue<IExplosiveObjectTypeDTO>):Promise<IExplosiveObjectTypeDTO> => DB.explosiveObjectType.update(id, value);
const remove = async (id:string) => {
	const isCreateExplosiveObject = await DB.explosiveObject.exist("typeId", id);

	if(isCreateExplosiveObject){
		throw new Error(ERRORS.HAS_RELATIONS);
	}

	return DB.explosiveObjectType.remove(id)
};
const getList = ():Promise<IExplosiveObjectTypeDTO[]> => DB.explosiveObjectType.select();
const init = ():Promise<IExplosiveObjectTypeDTO[]> => DB.explosiveObjectType.initData(explosiveObjectTypes, "fullName");

export const explosiveObjectType = {
	init,
	create,
	update,
	remove,
	getList
}