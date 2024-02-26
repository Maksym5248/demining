import { Instance } from 'mobx-state-tree';

import { ROLES } from '~/constants';

import { types } from '../../../../types'


export type ICurrentUser = Instance<typeof CurrentUser>

export const CurrentUser = types.model('CurrentUser', {
	id: types.identifier,
	roles: types.optional(types.array(types.enumeration<ROLES[]>(Object.values(ROLES))), []),
	organizationId: types.maybe(types.maybeNull(types.string)),
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).views(self => ({
	get isRootAdmin(){
		return self.roles.includes(ROLES.ROOT_ADMIN)
	},
	get isOrganizationAdmin(){
		return self.roles.includes(ROLES.ORGANIZATION_ADMIN) && !!self.organizationId
	},
})).views(self => ({
	get isAuthorized(){
		return !!self.isRootAdmin || !!self.isOrganizationAdmin;
	},
}));
