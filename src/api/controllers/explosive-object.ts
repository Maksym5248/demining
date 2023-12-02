import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { IExplosiveObjectDTO, IExplosiveObjectDTOParams } from '../types'

const add = async (value: CreateValue<IExplosiveObjectDTOParams>):Promise<IExplosiveObjectDTO> => {
 const explosiveObject = await DB.schemaExplosiveObject.add(value);
 const type = await DB.schemaExplosiveObjectType.get(value.typeId);

 return {
  ...explosiveObject,
  type
 }
};
const update = async (id:string, value: UpdateValue<IExplosiveObjectDTOParams>):Promise<IExplosiveObjectDTO> => {
  const explosiveObject = await DB.schemaExplosiveObject.update(id, value);
  const type = await DB.schemaExplosiveObjectType.get(value.typeId);
 
  return {
   ...explosiveObject,
   type
  }
};
const remove = (id:string) => DB.schemaExplosiveObject.remove(id);
const getList = async ():Promise<IExplosiveObjectDTO[]> => {
  const list = await DB.schemaExplosiveObject.select();
  const res = await Promise.all(list.map(async ({typeId, ...explosiveObject}) => {
    const type = await DB.schemaExplosiveObjectType.get(typeId);

    return {
      ...explosiveObject,
      type
    }
  }));

  return res
};

export const explosiveObject = {
  add,
  update,
  remove,
  getList
}