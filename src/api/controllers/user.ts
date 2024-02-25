import { UpdateValue } from '~/types'
import { DBRemote } from '~/db';

import { IUserDTO } from '../types'

const create = async (value: Pick<IUserDTO, "id">):Promise<IUserDTO> => {
	const res = await DBRemote.user.create({
		roles: [],
		organizationId: null,
		...value,
	});

	return res;
};
const update = (id:string, value: UpdateValue<IUserDTO>):Promise<IUserDTO> => DBRemote.user.update(id, value);
const remove = (id:string) => DBRemote.user.remove(id);
const getList = ():Promise<IUserDTO[]> => DBRemote.user.select();
const get = (id:string):Promise<IUserDTO | null> => DBRemote.user.get(id);
const exist = (id:string):Promise<boolean> => DBRemote.user.exist("id", id);

export const user = {
	create,
	update,
	remove,
	get,
	getList,
	exist
}