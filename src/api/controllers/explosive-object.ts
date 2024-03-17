import { DB, IQuery } from '~/db'
import { UpdateValue, CreateValue } from '~/types'
import { explosiveObjectsData } from '~/data';

import { IExplosiveObjectDTO, IExplosiveObjectDTOParams } from '../types'

const create = async (value: CreateValue<IExplosiveObjectDTOParams>):Promise<IExplosiveObjectDTO> => {
	const explosiveObject = await DB.explosiveObject.create(value);
	if(!explosiveObject) throw new Error("there is explosive object");
	return explosiveObject
};

const update = async (id:string, value: UpdateValue<IExplosiveObjectDTOParams>):Promise<IExplosiveObjectDTO> => {
	const explosiveObject = await DB.explosiveObject.update(id, value);

	if(!explosiveObject) throw new Error("there is explosive object");

	return explosiveObject
};

const remove = (id:string) => DB.explosiveObject.remove(id);

const getList = async (query?: IQuery):Promise<IExplosiveObjectDTO[]> => DB.explosiveObject.select({
	order: {
		by: "createdAt",
		type: "desc"
	},
	...(query ?? {})
});

const init = async ():Promise<void> => {
	const count = await DB.explosiveObject.count();

	if(count) return;

	DB.batchStart();

	explosiveObjectsData.forEach((el) => {
		DB.explosiveObject.create(el);
	});

	await DB.batchCommit();
};

const get = async (id:string):Promise<IExplosiveObjectDTO> => {
	const res = await DB.explosiveObject.get(id);
	if(!res) throw new Error("there is explosiveObject with id");
	return res;
}

export const explosiveObject = {
	create,
	update,
	remove,
	getList,
	init,
	get
}