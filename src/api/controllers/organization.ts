import { DB, IOrganizationDB, IQuery, IUserDB } from '~/db';
import { ROLES } from '~/constants';

import { IOrganizationDTO, IUserDTO, ICreateOrganizationDTO } from '../types'

const create = async (value: Pick<ICreateOrganizationDTO, "name">):Promise<IOrganizationDTO> => {
	const { membersIds, ...organization} = await DB.organization.create({
		...value,
		membersIds: []
	});

	return organization;
};

const update = async (id:string, value: ICreateOrganizationDTO):Promise<Omit<IOrganizationDTO, "members">> => {
	const res = await DB.organization.update(id, value);
	const { membersIds, ...organization} = res;
	return organization
};

const updateMember = async (organizationId:string, userId: string, isAdmin: boolean, isRootAdmin:boolean):Promise<IUserDTO> => {
	const [
		organization,
		user 
	] = await Promise.all([
		DB.organization.get(organizationId),
		DB.user.get(userId) as Promise<IUserDTO>
	]);

	const membersIds = organization?.membersIds ?? [];
	const userRolesWithAdmin = user.roles.includes(ROLES.ORGANIZATION_ADMIN) ? user.roles : [...user.roles, ROLES.ORGANIZATION_ADMIN];
	const roles = isAdmin ? userRolesWithAdmin : user.roles.filter(el => el !== ROLES.ORGANIZATION_ADMIN);

	await Promise.all([
		DB.organization.update(organizationId, {
			membersIds: membersIds.includes(userId) ? membersIds : [...membersIds, userId],
		}),
		DB.user.update(userId, {
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
		DB.organization.get(organizationId) as Promise<IOrganizationDB>,
		DB.user.get(userId) as Promise<IUserDB>
	]);

	await Promise.all([
		DB.organization.update(organizationId, {
			membersIds: organization.membersIds.filter(el => el !== userId)
		}),
		DB.user.update(userId, {
			 organizationId: null,
			 roles: user.roles.filter(el => el !== ROLES.ORGANIZATION_ADMIN)
		})
	]);
};


const remove = (id:string) => DB.organization.remove(id);

const getList = async (query?: IQuery):Promise<IOrganizationDTO[]> => {
	const organizations = await DB.organization.select({
		order: {
			by: "createdAt",
			type: "desc"
		},
		...(query ?? {})
	});
	return organizations.map(({ membersIds,  ...restOrganization}) => restOrganization)
};

const get = async (id:string):Promise<IOrganizationDTO | null> => {
	const res = await DB.organization.get(id);

	if(!res){
		return null;
	}

	const { membersIds, ...organization} = res;

	return organization
};

const getOrganizationMembers = async (id:string):Promise<IUserDTO[]> => {
	const res = await DB.user.select({
		where: {
			organizationId: id
		}
	});

	if(!res){
		return [];
	}

	return res
};

const exist = (id:string):Promise<boolean> => DB.organization.exist("id", id);

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