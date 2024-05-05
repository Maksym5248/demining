import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Analytics, Auth, Logger } from "~/services";
import { Api, ICurrentUserDTO } from '~/api';

import { CurrentUser, createCurrentUser } from './entities';
import { asyncAction } from '../../utils';

const Store = types
	.model('ViewerStore', {
		user: types.maybeNull(types.maybe(CurrentUser)),
		isLoadingUserInfo: true
	})
	.actions((self) => ({
		setUser(user: ICurrentUserDTO) {
			// @ts-expect-error
			self.user = createCurrentUser(user);

			if(user.organization?.id){
				Api.user.setOrganization(user.organization?.id);
			}
		},
		removeUser() {
			self.user = null;
			Api.user.removeOrganization();
		},
		setLoadingUserInfo(value: boolean) {
			self.isLoadingUserInfo = value;
		},
	}));


const initUser = asyncAction<Instance<typeof Store>>(() => async ({ flow, self }) => {
	try {
		flow.start();

		Auth.onAuthStateChanged(async (user) => {
			try {
				if(user){
					Analytics.setUserId(user.uid);
					await Auth.refreshToken();
					const res = await Api.user.get(user.uid);

					if(res) self.setUser(res);
				}  else {
					Analytics.setUserId(null)
					self.removeUser();
				}
			} catch(e){
				Logger.error(e);
				message.error('Bиникла помилка');
				self.removeUser();
			}

			self.setLoadingUserInfo(false);
		})

		flow.success();
	} catch (e) {
		flow.failed(e as Error);
	}
});

export const ViewerStore = Store.props({
	initUser,
});
