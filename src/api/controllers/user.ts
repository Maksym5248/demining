import { UpdateValue } from '~/types'
import { DBRemote } from '~/db';

import { IUserDTO } from '../types'

const create = (value: Omit<IUserDTO, "createdAt" | "updatedAt">):Promise<IUserDTO> => DBRemote.user.create(value);
const update = (id:string, value: UpdateValue<IUserDTO>):Promise<IUserDTO> => DBRemote.user.update(id, value);
const remove = (id:string) => DBRemote.user.remove(id);
const getList = ():Promise<IUserDTO[]> => DBRemote.user.select();
const get = (id:string):Promise<IUserDTO | null> => DBRemote.user.get(id);

export const user = {
	create,
	update,
	remove,
	get,
	getList
}