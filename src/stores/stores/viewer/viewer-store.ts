import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Analytics, Auth, Logger } from "~/services";
import { Api, IUserDTO } from '~/api';

import { CurrentUser, createCurrentUser } from './entities';
import { asyncAction } from '../../utils';

const Store = types
	.model('ViewerStore', {
		user: types.maybeNull(types.maybe(CurrentUser)),
		isLoadingUserInfo: false
	})
	.views(self => ({
		get isUser(){
			return !!self.user
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
		setLoadingUserInfo(value: boolean) {
			self.isLoadingUserInfo = value;
		},
	})).actions((self) => ({
		async getUserData(id: string) {
			self.setLoadingUserInfo(true);

			try {
				let user = await Api.user.get(id);

				if(!user) {
					user = await Api.user.create({ id });
				}

				self.setUser(user)
				Analytics.setUserId(id);
			} catch(e){
				Logger.error(e);
				message.error('Bиникла помилка');
				self.removeUser();
			}
			
			self.setLoadingUserInfo(false);
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
