import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Analytics, Auth, Logger } from "~/services";
import { Api, IUserDTO } from '~/api';

import { CurrentUser, createCurrentUser } from './entities';
import { asyncAction } from '../../utils';

const Store = types
	.model('ViewerStore', {
		user: types.maybeNull(types.maybe(CurrentUser)),
	})
	.views(self => ({
		get isAuthorized(){
			return !!self.user
		},
		get isLoadUserInfo(){
			return self.user !== undefined
		},
	}))
	.actions((self) => ({
		setUser(user: IUserDTO) {
			// @ts-expect-error
			self.user = createCurrentUser(user);
		},
		removeUser() {
			self.user = null;
		},
	})).actions((self) => ({
		async getUserData(id: string) {
			try {
				let user = await Api.user.get(id);

				if(!user) {
					user = await Api.user.create({ id });
				}

				Analytics.setUserId(id);
				self.setUser(user)
			} catch(e){
				Logger.error(e)
				self.removeUser();
				message.error('Bиникла помилка');
			}

		},
	}));


const initUser = asyncAction<Instance<typeof Store>>(() => async ({ flow, self }) => {
	try {
		flow.start();

		Auth.onAuthStateChanged((user) => {
			if(user){
				Analytics.setUserId(user.uid)
				self.getUserData(user.uid);
			}  else {
				Analytics.setUserId(null)
				self.removeUser();
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
