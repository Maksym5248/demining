import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'

import { IExplosiveObjectDTO, IExplosiveObjectDTOParams } from '../types'
import { explosiveObjectType } from "./explosive-object-type";
import { explosiveObjects } from "../data";

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

const init = async ():Promise<void> => {
  const types = await explosiveObjectType.getList();
  const idACType = types.find(el => el.name === "AC");
  const idММType = types.find(el => el.name === "ММ");
  const idMLRSType = types.find(el => el.name === "РСЗВ");
  const idRGType = types.find(el => el.name === "РГ");
  const idIMType = types.find(el => el.name === "ІМ");

  await Promise.all([ 
        DB.schemaExplosiveObject.initData(
          explosiveObjects.AC.map((caliber) => ({
            typeId: idACType.id,
            name: "",
            caliber
          })
        ), "caliber"),
        DB.schemaExplosiveObject.initData(
          explosiveObjects.MM.map((caliber) => ({
            typeId: idММType.id,
            name: "",
            caliber
          })
        ), "caliber"),
        DB.schemaExplosiveObject.initData(
          explosiveObjects.MLRS.map((caliber) => ({
            typeId: idMLRSType.id,
            name: "",
            caliber
          })
        ), "caliber"),
        DB.schemaExplosiveObject.initData(
          explosiveObjects.RG.map((name) => ({
            typeId: idRGType.id,
            name
          })
        ), "name"),
        DB.schemaExplosiveObject.initData(
          explosiveObjects.IM.map((name) => ({
            typeId: idIMType.id,
            name
          })
        ), "name"),
  ]);
};


export const explosiveObject = {
  add,
  update,
  remove,
  getList,
  init
}