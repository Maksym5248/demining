import keyBy from "lodash/keyBy"
import map from "lodash/map"
import uniq from "lodash/uniq"

import { UpdateValue } from '~/types'
import { DBRemote, IOrganizationDB, IUserDB } from '~/db';

import { ICurrentUserDTO, IUserDTO, IUserOrganizationDTO } from '../types'

const getIds = <T>(arr:T[], key:string) => uniq(map(arr, key).filter(el => !!el)) as string[];

const getUserOrganization = async (user:IUserDB | null): Promise<IUserOrganizationDTO | null> => {
	if(!user || !user?.organizationId){
		return null;
	}

	const res = await DBRemote.organization.get(user.organizationId);

	if(!res){
		return null
	}

	const { membersIds, ...organization} = res;

	return organization;
}

const create = async (value: Pick<ICurrentUserDTO, "id" | "email">):Promise<ICurrentUserDTO> => {
	const { organizationId, ...user} = await DBRemote.user.create({
		roles: [],
		organizationId: null,
		...value,
	});

	return {
		...user,
		organization: null
	};
};

const update = async (id:string, value: UpdateValue<ICurrentUserDTO>):Promise<ICurrentUserDTO> => {
	const res = await DBRemote.user.update(id, value);

	const organization = await getUserOrganization(res);
	const { organizationId, ...user} = res;

	return {
		...user,
		organization
	}

};

const remove = (id:string) => DBRemote.user.remove(id);

const getList = async ():Promise<ICurrentUserDTO[]> => {
	const users = await DBRemote.user.select();

	const organizationIds = getIds(users, "organizationId");

	const organizations = await Promise.all(
		organizationIds.map((organizationId) => DBRemote.organization.get(organizationId))
	) as IOrganizationDB[];

	const collection = keyBy(organizations, "id");

	return users.map(({ organizationId,  ...restUser}) => ({
		...restUser,
		organization: organizationId ? collection[organizationId] : null
	}))
};

const getListUnassignedUsers = ():Promise<IUserDTO[]> => DBRemote.user.select({
	where: {
		organizationId: null
	}
})

const get = async (id:string):Promise<ICurrentUserDTO | null> => {
	const res = await DBRemote.user.get(id);

	if(!res){
		return null;
	}

	const organization = await getUserOrganization(res);
	const { organizationId, ...user} = res;

	return {
		...user,
		organization
	}
};

const exist = (id:string):Promise<boolean> => DBRemote.user.exist("id", id);

export const user = {
	create,
	update,
	remove,
	get,
	getList,
	exist,
	getListUnassignedUsers
}