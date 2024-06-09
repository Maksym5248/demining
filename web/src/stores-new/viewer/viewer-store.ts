import { message } from 'antd';

import { Api } from '~/api';
import { Analytics, AuthService, Logger } from '~/services';

import { CurrentUser, ICurrentUser, IUserValue, createUser } from './entities';

export interface IViewerStore {
    user: ICurrentUser | null;
    isInitialized: boolean;
    isLoading: boolean;
    setUser(user: IUserValue): void;
    removeUser(): void;
    setInitialized(value: boolean): void;
    setLoading(value: boolean): void;
    initUser(): void;
}

export class ViewerStore {
    user: ICurrentUser | null = null;
    isInitialized = false;
    isLoading = false;

    setUser(user: IUserValue) {
        this.user = new CurrentUser(user);

        if (user.organization?.id) {
            Api.user.setOrganization(user.organization?.id);
        }
    }

    removeUser() {
        this.user = null;
        Api.user.removeOrganization();
    }

    setInitialized(value: boolean) {
        this.isInitialized = value;
    }

    setLoading(value: boolean) {
        this.isLoading = value;
    }

    initUser() {
        try {
            this.setLoading(true);

            AuthService.onAuthStateChanged(async (user) => {
                try {
                    if (user) {
                        Analytics.setUserId(user.uid);
                        await AuthService.refreshToken();
                        const res = await Api.user.get(user.uid);

                        if (res) this.setUser(createUser(res));
                    } else {
                        Analytics.setUserId(null);
                        this.removeUser();
                    }
                } catch (e) {
                    Logger.error(e);
                    message.error('Bиникла помилка');
                    this.removeUser();
                }

                this.setInitialized(true);
                this.setLoading(false);
            });
        } catch (e) {
            Logger.error(e);
            message.error('Bиникла помилка');
            this.setLoading(false);
        }
    }
}
