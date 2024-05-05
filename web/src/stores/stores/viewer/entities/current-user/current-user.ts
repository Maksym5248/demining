import { Instance } from 'mobx-state-tree';

import { ROLES } from '~/constants';

import { types } from '../../../../types'


export type ICurrentUser = Instance<typeof CurrentUser>

const CurrentUserOrganization = types.model('CurrentUserOrganization', {
	id: types.identifier,
	name: types.string,
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
})

export const CurrentUser = types.model('CurrentUser', {
	id: types.identifier,
	roles: types.optional(types.array(types.enumeration<ROLES[]>(Object.values(ROLES))), []),
	organization: types.maybe(types.maybeNull(CurrentUserOrganization)),
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).views(self => ({
	get isRootAdmin(){
		return self.roles.includes(ROLES.ROOT_ADMIN)
	},
	get isOrganizationAdmin(){
		return self.roles.includes(ROLES.ORGANIZATION_ADMIN) && !!self.organization
	},
	get isOrganizationMember(){
		return !!self.organization
	},
})).views(self => ({
	get isAuthorized(){
		return !!self.isRootAdmin || !!self.isOrganizationAdmin || !!self.isOrganizationMember;
	},
	get isWaitingApproved(){
		return !!self.id && !self.organization;
	},
}));
