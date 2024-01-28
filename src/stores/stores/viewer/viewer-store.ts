import { types, Instance } from 'mobx-state-tree';

import { ROLES } from "~/constants";
import { Auth } from "~/services";

import { CurrentUser, ICurrentUser, createCurrentUser } from './entities';
import { asyncAction } from '../../utils';

const Store = types
	.model('ViewerStore', {
		// collection
		// list
		// filteredList
		user: types.maybe(CurrentUser),
	})
	.actions((self) => ({
		setUser(user: ICurrentUser) {
			self.user = createCurrentUser(user);
		},
		removeUser() {
			self.user = undefined;
		},
	}));

const fetchUser = asyncAction<Instance<typeof Store>>(() => async ({ flow, self }) => {

	try {
		flow.start();

		self.setUser({
			id: "Default-user",
			name: "Default-user",
			role: ROLES.USER,
		});

		Auth.signInAnonymously();

		flow.success();
	} catch (e) {
		flow.failed(e as Error);
	}
});

export const ViewerStore = Store.props({
	fetchUser,
});
