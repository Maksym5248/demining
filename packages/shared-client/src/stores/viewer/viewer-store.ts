import { message } from 'antd';
import { type User } from 'firebase/auth';
import { makeAutoObservable } from 'mobx';

import { Api } from '~/api';
import { Analytics, AuthService, Logger } from '~/services';

import { CurrentUser, type ICurrentUser, type ICurrentUserValue, createCurrentUser } from './entities';

export interface IViewerStore {
    user: ICurrentUser | null;
    isInitialized: boolean;
    isLoading: boolean;
    setUser(user: ICurrentUserValue): void;
    removeUser(): void;
    setInitialized(value: boolean): void;
    setLoading(value: boolean): void;
    initUser(): void;
}

export class ViewerStore {
    user: ICurrentUser | null = null;
    isInitialized = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: ICurrentUserValue) {
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

    private async onChangeUser(user: User | null) {
        try {
            if (user) {
                Analytics.setUserId(user.uid);
                await AuthService.refreshToken();
                const res = await Api.user.get(user.uid);

                if (res) this.setUser(createCurrentUser(res));
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
    }

    initUser() {
        try {
            this.setLoading(true);

            AuthService.onAuthStateChanged((user) => this.onChangeUser(user));
        } catch (e) {
            Logger.error(e);
            message.error('Bиникла помилка');
            this.setLoading(false);
        }
    }
}
