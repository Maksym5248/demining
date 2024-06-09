import { message } from 'antd';
import { types, Instance } from 'mobx-state-tree';

import { Api, ICurrentUserDTO } from '~/api';
import { Analytics, AuthService, Logger } from '~/services';

import { CurrentUser, createCurrentUser } from './entities';
import { asyncAction } from '../../utils';

const Store = types
    .model('ViewerStore', {
        user: types.maybeNull(types.maybe(CurrentUser)),
        isInitialized: false,
        isLoading: false,
    })
    .actions((self) => ({
        setUser(user: ICurrentUserDTO) {
            // @ts-expect-error
            self.user = createCurrentUser(user);

            if (user.organization?.id) {
                Api.user.setOrganization(user.organization?.id);
            }
        },
        removeUser() {
            self.user = null;
            Api.user.removeOrganization();
        },
        setInitialized(value: boolean) {
            self.isInitialized = value;
        },
        setLoading(value: boolean) {
            self.isLoading = value;
        },
    }));

const initUser = asyncAction<Instance<typeof Store>>(() => async ({ flow, self }) => {
    try {
        flow.start();

        AuthService.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    Analytics.setUserId(user.uid);
                    await AuthService.refreshToken();
                    const res = await Api.user.get(user.uid);

                    if (res) self.setUser(res);
                } else {
                    Analytics.setUserId(null);
                    self.removeUser();
                }
            } catch (e) {
                Logger.error(e);
                message.error('Bиникла помилка');
                self.removeUser();
            }

            self.setInitialized(true);
            self.setLoading(false);
        });

        flow.success();
    } catch (e) {
        flow.failed(e as Error);
    }
});

export const ViewerStore = Store.props({
    initUser,
});
