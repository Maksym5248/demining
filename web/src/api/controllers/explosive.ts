import { IQuery } from '@/shared'

import { DB } from '~/db'
import { UpdateValue, CreateValue } from '~/types'
import { EXPLOSIVE_TYPE } from '~/constants/db/explosive-type';

import { IExplosiveDTO } from '../types'

const create = async (value: CreateValue<IExplosiveDTO>):Promise<IExplosiveDTO> => {
	const explosive = await DB.explosive.create(value);
	if(!explosive) throw new Error("there is explosive by id");
	return explosive
};

const update = async (id:string, value: UpdateValue<IExplosiveDTO>):Promise<IExplosiveDTO> => {
	const explosive = await DB.explosive.update(id, value);

	if(!explosive) throw new Error("there is explosive object");

	return explosive
};

const remove = (id:string) => DB.explosive.remove(id);

const getList = async (query?: IQuery):Promise<IExplosiveDTO[]> => DB.explosive.select({
	order: {
		by: "createdAt",
		type: "desc"
	},
	...(query ?? {})
});

const getListExplosive = async (query?: IQuery):Promise<IExplosiveDTO[]> => DB.explosive.select({
	...(query ?? {}),
	order: {
		by: "createdAt",
		type: "desc"
	},
	where: {
		...(query?.where ?? {}),
		type: EXPLOSIVE_TYPE.EXPLOSIVE
	},
});

const getListDetonators = async (query?: IQuery):Promise<IExplosiveDTO[]> => DB.explosive.select({
	...(query ?? {}),
	order: {
		by: "createdAt",
		type: "desc"
	},
	where: {
		...(query?.where ?? {}),
		type: EXPLOSIVE_TYPE.DETONATOR
	},
});


const get = async (id:string):Promise<IExplosiveDTO> => {
	const res = await DB.explosive.get(id);
	if(!res) throw new Error("there is explosive with id");
	return res;
}

const sum = async (query?: IQuery):Promise<{
	explosive: number,
	detonator: number,
}> => {
	const [
		explosive,
		detonator,
	] = await Promise.all([
		DB.explosiveAction.sum("weight", {
			where: {
				type: EXPLOSIVE_TYPE.EXPLOSIVE,
				...(query?.where ?? {})
			},
		}),
		DB.explosiveAction.sum("quantity", {
			where: {
				type: EXPLOSIVE_TYPE.DETONATOR,
				...(query?.where ?? {})
			},
		}),
	]);

	return {
		explosive,
		detonator,
	};
}

export const explosive = {
	create,
	update,
	remove,
	getList,
	getListExplosive,
	getListDetonators,
	get,
	sum
}