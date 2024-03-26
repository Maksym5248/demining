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
	})).actions((self) => ({
		async getUserData(id: string, email:string) {
			try {

				let user = await Api.user.get(id);

				if(!user) {
					user = await Api.user.create({ id, email });
				}

				self.setUser(user)
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
				self.getUserData(user.uid, user.email as string);
			}  else {
				Analytics.setUserId(null)
				self.removeUser();
				self.setLoadingUserInfo(false);
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
