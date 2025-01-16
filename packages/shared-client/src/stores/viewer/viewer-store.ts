import { makeAutoObservable } from 'mobx';

import { type IUserAPI } from '~/api';
import { type IAnalytics, type IAuth, type ILogger, type IMessage } from '~/services';

import { CurrentUser, type ICurrentUser, type ICurrentUserData } from './entities';

export interface IViewerStore {
    user: ICurrentUser | null;
    isLoading: boolean;
    setLoading(isLoading: boolean): void;
    setUser(user: ICurrentUserData): void;
    removeUser(): void;
}

interface IApi {
    user: IUserAPI;
}

interface IServices {
    analytics: IAnalytics;
    auth: IAuth;
    logger: ILogger;
    message: IMessage;
}

interface IViewerStoreParams {
    api: IApi;
    services: IServices;
}
export class ViewerStore implements IViewerStore {
    api: IApi;
    services: IServices;
    user: ICurrentUser | null = null;
    isLoading = false;

    constructor(params: IViewerStoreParams) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    setUser(user: ICurrentUserData) {
        this.user = new CurrentUser(user);

        if (user.organization?.id) {
            this.api.user.setOrganization(user.organization?.id);
        }
    }

    removeUser() {
        this.user = null;
        this.api.user.removeOrganization();
    }
}
