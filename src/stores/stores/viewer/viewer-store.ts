import { types, Instance } from 'mobx-state-tree';
import { User } from 'firebase/auth';

import { Analytics, Auth } from "~/services";

import { CurrentUser, createCurrentUser } from './entities';
import { asyncAction } from '../../utils';

const Store = types
	.model('ViewerStore', {
		user: types.maybe(CurrentUser),
	})
	.actions((self) => ({
		setUser(user: User) {
			self.user = createCurrentUser(user);
		},
		removeUser() {
			self.user = undefined;
		},
	}));

const initUser = asyncAction<Instance<typeof Store>>(() => async ({ flow, self }) => {

	try {
		flow.start();

		Auth.onAuthStateChanged((user) => {
			if(user){
				Analytics.setUserId(user.uid)
				self.setUser(user);
			}  else {
				Auth.signInAnonymously();
			}
		})

		flow.success();
	} catch (e) {
		flow.failed(e as Error);
	}
});

export const ViewerStore = Store.props({
	initUser,
});
