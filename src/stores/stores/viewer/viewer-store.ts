import { types, Instance } from 'mobx-state-tree';
import { User } from 'firebase/auth';

import { STORAGE } from "~/constants";
import { Analytics, Auth, Storage } from "~/services";

import { CurrentUser, createCurrentUser } from './entities';
import { asyncAction } from '../../utils';

const Store = types
	.model('ViewerStore', {
		// collection
		// list
		// filteredList
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

		// TODO: Fix  it, make avaible all libs in chromium(disable node)
		// or find way to to set envoirment of firebase on web(currently it node)
		// also in case if we want to migrate on firebase maybe better to not use electron
		let user = Storage.get(STORAGE.USER) as User;

		if(!user){
			const res  = await Auth.signInAnonymously();
			user = res.user;
			Storage.set(STORAGE.USER, user);
		}

		if(user){
			Analytics.setUserId(user.uid)
			self.setUser(user);
		}

		flow.success();
	} catch (e) {
		flow.failed(e as Error);
	}
});

export const ViewerStore = Store.props({
	initUser,
});
