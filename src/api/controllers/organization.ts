import { DBRemote, IOrganizationDB, IUserDB } from '~/db';
import { ROLES } from '~/constants';

import { IOrganizationDTO, IUserDTO, ICreateOrganizationDTO } from '../types'

const getMembers = async (organization:Pick<IOrganizationDB, "membersIds"> | null): Promise<IUserDTO[]> => {
	if(!organization || !organization?.membersIds){
		return [];
	}

	const users = await Promise.all(
		organization.membersIds.map((id) => DBRemote.user.get(id))
	) as IUserDB[]

	return users;
}

const create = async (value: Pick<ICreateOrganizationDTO, "name">):Promise<IOrganizationDTO> => {
	const { membersIds, ...organization} = await DBRemote.organization.create({
		...value,
		membersIds: []
	});

	return organization;
};

const update = async (id:string, value: ICreateOrganizationDTO):Promise<Omit<IOrganizationDTO, "members">> => {
	const res = await DBRemote.organization.update(id, value);
	const { membersIds, ...organization} = res;
	return organization
};

const updateMember = async (organizationId:string, userId: string, isAdmin: boolean, isRootAdmin:boolean):Promise<IUserDTO> => {
	const [
		organization,
		user 
	] = await Promise.all([
		DBRemote.organization.get(organizationId),
		DBRemote.user.get(userId) as Promise<IUserDTO>
	]);

	const membersIds = organization?.membersIds ?? [];
	const userRolesWithAdmin = user.roles.includes(ROLES.ORGANIZATION_ADMIN) ? user.roles : [...user.roles, ROLES.ORGANIZATION_ADMIN];
	const roles = isAdmin ? userRolesWithAdmin : user.roles.filter(el => el !== ROLES.ORGANIZATION_ADMIN);

	await Promise.all([
		DBRemote.organization.update(organizationId, {
			membersIds: membersIds.includes(userId) ? membersIds : [...membersIds, userId],
		}),
		DBRemote.user.update(userId, {
			 organizationId,
			 ...(isRootAdmin? { roles } : {}),
		})
	]);

	return {...user, roles, organizationId};
};

const removeMember = async (organizationId:string, userId: string):Promise<void> => {
	const [
		organization,
		user 
	] = await Promise.all([
		DBRemote.organization.get(organizationId) as Promise<IOrganizationDB>,
		DBRemote.user.get(userId) as Promise<IUserDB>
	]);

	await Promise.all([
		DBRemote.organization.update(organizationId, {
			membersIds: organization.membersIds.filter(el => el !== userId)
		}),
		DBRemote.user.update(userId, {
			 organizationId: null,
			 roles: user.roles.filter(el => el !== ROLES.ORGANIZATION_ADMIN)
		})
	]);
};


const remove = (id:string) => DBRemote.organization.remove(id);

const getList = async ():Promise<IOrganizationDTO[]> => {
	const organizations = await DBRemote.organization.select();
	return organizations.map(({ membersIds,  ...restOrganization}) => restOrganization)
};

const get = async (id:string):Promise<IOrganizationDTO | null> => {
	const res = await DBRemote.organization.get(id);

	if(!res){
		return null;
	}

	const { membersIds, ...organization} = res;

	return organization
};

const getOrganizationMembers = async (id:string):Promise<IUserDTO[]> => {
	const res = await DBRemote.organization.get(id);

	if(!res){
		return [];
	}

	const members = await getMembers(res);
	return members
};

const exist = (id:string):Promise<boolean> => DBRemote.organization.exist("id", id);

export const organization = {
	create,
	update,
	updateMember,
	removeMember,
	remove,
	get,
	getMembers: getOrganizationMembers,
	getList,
	exist
}