import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS, type ROLES } from 'shared-my';

import { type IUserAPI, type ICurrentUserAPI } from '~/api';
import { type IRequestModel, RequestModel } from '~/models';
import { type IAuthUser, type IAnalytics, type IAuth, type ILogger, type IMessage } from '~/services';

import { CurrentUser, Permissions, type IPermissions, type ICurrentUser, type ICurrentUserData, createCurrentUser } from './entities';

export interface IViewerStore {
    user: ICurrentUser | null;
    permissions: IPermissions;
    isLoading: boolean;
    isAnonymous: boolean;
    isEmailVerified: boolean;
    isAuthenticated: boolean;
    isRegistered: boolean;
    status: {
        demining: APPROVE_STATUS | null;
    };
    hasRole: (role: ROLES) => boolean;
    setLoading(isLoading: boolean): void;
    setUser(user: ICurrentUserData): void;
    setAuthData(authData: IAuthUser | null): void;
    removeUser(): void;
    fetchCurrentUser: IRequestModel;
}

interface IApi {
    currentUser: ICurrentUserAPI;
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

        if (
            !!this.user.id &&
            !this.permissions.dictionary.view() &&
            !this.permissions.managment.view() &&
            !this.permissions.documents.view()
        ) {
            return APPROVE_STATUS.PENDING;
        }

        if (
            !!this.user.id &&
            (this.permissions.documents.view() || this.permissions.managment.view() || this.permissions.dictionary.view())
        ) {
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

    get isEmailVerified() {
        return !!this.authData?.emailVerified;
    }

    get isRegistered() {
        return !!this.user?.id && !this.isAnonymous;
    }

    get isAuthenticated() {
        return !!this.user?.id && !this.isAnonymous && !!this.isEmailVerified;
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    setAuthData(authData: IAuthUser | null) {
        this.authData = authData;
    }

    setUser(user: ICurrentUserData) {
        this.user = new CurrentUser(user, this);

        if (user.organization?.id) {
            this.api.currentUser.setOrganization(user.organization?.id);
        }
    }

    fetchCurrentUser = new RequestModel({
        returnIfLoading: true,
        retry: 10,
        run: async () => {
            if (!this.authData?.uid) {
                throw new Error('No user data');
            }

            const res = await this.api.currentUser.get(this.authData.uid);

            if (!res) {
                throw new Error('No user data');
            }

            this.setUser(createCurrentUser(res));
            this.setAuthData(this.services.auth.currentUser());
        },
    });

    removeUser() {
        this.user = null;
        this.api.currentUser.removeOrganization();
    }
}
