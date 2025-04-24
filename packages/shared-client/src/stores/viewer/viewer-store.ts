import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS, type ROLES } from 'shared-my';

import { type ICurrentUserAPI } from '~/api';
import { type IAuthUser, type IAnalytics, type IAuth, type ILogger, type IMessage } from '~/services';

import { CurrentUser, Permissions, type IPermissions, type ICurrentUser, type ICurrentUserData } from './entities';

export interface IViewerStore {
    user: ICurrentUser | null;
    permissions: IPermissions;
    isLoading: boolean;
    isAnonymous: boolean;
    isAuthenticated: boolean;
    status: {
        demining: APPROVE_STATUS | null;
    };
    hasRole: (role: ROLES) => boolean;
    setLoading(isLoading: boolean): void;
    setUser(user: ICurrentUserData): void;
    setAuthData(authData: IAuthUser | null): void;
    removeUser(): void;
}

interface IApi {
    currentUser: ICurrentUserAPI;
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
    permissions: IPermissions;
    authData: IAuthUser | null = null;

    isLoading = false;

    constructor(params: IViewerStoreParams) {
        this.api = params.api;
        this.services = params.services;

        this.permissions = new Permissions(this);

        makeAutoObservable(this);
    }

    hasRole(role: ROLES) {
        return !!this.user?.data.access[role];
    }

    get deminingStatus() {
        if (!this.user?.id) {
            return null;
        }

        if (!!this.user.id && !this.permissions.documents.view()) {
            return APPROVE_STATUS.PENDING;
        }

        if (!!this.user.id && !!this.permissions.documents.view()) {
            return APPROVE_STATUS.CONFIRMED;
        }

        return null;
    }

    get status() {
        return {
            demining: this.deminingStatus,
        };
    }

    get isAnonymous() {
        return !!this.authData?.isAnonymous;
    }

    get isAuthenticated() {
        console.log('isAuthenticated', this.user?.id, this.authData, this.isAnonymous);
        return !!this.user?.id && !this.isAnonymous;
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    setAuthData(authData: IAuthUser | null) {
        this.authData = authData;
    }

    setUser(user: ICurrentUserData) {
        this.user = new CurrentUser(user);

        if (user.organization?.id) {
            this.api.currentUser.setOrganization(user.organization?.id);
        }
    }

    removeUser() {
        this.user = null;
        this.api.currentUser.removeOrganization();
    }
}
