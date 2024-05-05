import { Instance } from 'mobx-state-tree';

import { ROLES } from '~/constants';

import { types } from '../../../../types'

export type IUser = Instance<typeof User>

export const User = types.model('User', {
	id: types.identifier,
	email: types.string,
	organizationId: types.optional(types.string, ""),
	roles: types.optional(types.array(types.enumeration<ROLES[]>(Object.values(ROLES))), []),
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).views(self => ({
	get isRootAdmin(){
		return self.roles.includes(ROLES.ROOT_ADMIN)
	},
	get isOrganizationAdmin(){
		return self.roles.includes(ROLES.ORGANIZATION_ADMIN) && !!self.organizationId
	},
	get isOrganizationMember(){
		return !!self.organizationId
	},
}));

