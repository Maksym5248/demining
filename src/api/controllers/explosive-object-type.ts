import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'
import { ERRORS } from '~/constants'

import { IExplosiveObjectTypeDTO } from '../types'
import {explosiveObjectTypes } from '../data'

const add = (value: CreateValue<IExplosiveObjectTypeDTO>):Promise<IExplosiveObjectTypeDTO> => DB.schemaExplosiveObjectType.add(value);
const update = (id:string, value: UpdateValue<IExplosiveObjectTypeDTO>):Promise<IExplosiveObjectTypeDTO> => DB.schemaExplosiveObjectType.update(id, value);
const remove = async (id:string) => {
  const isCreateExplosiveObject = await DB.schemaExplosiveObject.exist("typeId", id);

  if(isCreateExplosiveObject){
    throw new Error(ERRORS.HAS_RELATIONS);
  }

  return DB.schemaExplosiveObjectType.remove(id)
};
const getList = ():Promise<IExplosiveObjectTypeDTO[]> => DB.schemaExplosiveObjectType.select();
const init = ():Promise<IExplosiveObjectTypeDTO[]> => DB.schemaExplosiveObjectType.initData(explosiveObjectTypes, "fullName");

export const explosiveObjectType = {
  init,
  add,
  update,
  remove,
  getList
}