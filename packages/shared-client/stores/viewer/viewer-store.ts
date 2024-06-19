import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { type IUserAPI } from '~/api';
import { type IAuthUser, type IAnalytics, type IAuth, type ILogger } from '~/services';

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

interface IApi {
    user: IUserAPI;
}

interface IViewerStoreParams {
    api: IApi;
    services: {
        analytics: IAnalytics;
        auth: IAuth;
        logger: ILogger;
    };
}
export class ViewerStore implements IViewerStore {
    api: IApi;
    services: {
        analytics: IAnalytics;
        auth: IAuth;
        logger: ILogger;
    };
    user: ICurrentUser | null = null;
    isInitialized = false;
    isLoading = false;

    constructor(params: IViewerStoreParams) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    setUser(user: ICurrentUserValue) {
        this.user = new CurrentUser(user);

        if (user.organization?.id) {
            this.api.user.setOrganization(user.organization?.id);
        }
    }

    removeUser() {
        this.user = null;
        this.api.user.removeOrganization();
    }

    setInitialized(value: boolean) {
        this.isInitialized = value;
    }

    setLoading(value: boolean) {
        this.isLoading = value;
    }

    private async onChangeUser(user: IAuthUser | null) {
        try {
            if (user) {
                this.services.analytics.setUserId(user.uid);
                await this.services.auth.refreshToken();
                const res = await this.api.user.get(user.uid);

                if (res) this.setUser(createCurrentUser(res));
            } else {
                this.services.analytics.setUserId(null);
                this.removeUser();
            }
        } catch (e) {
            this.services.logger.error(e);
            message.error('Bиникла помилка');
            this.removeUser();
        }

        this.setInitialized(true);
        this.setLoading(false);
    }

    initUser() {
        try {
            this.setLoading(true);

            this.services.auth.onAuthStateChanged((user) => this.onChangeUser(user));
        } catch (e) {
            this.services.logger.error(e);
            message.error('Bиникла помилка');
            this.setLoading(false);
        }
    }
}
