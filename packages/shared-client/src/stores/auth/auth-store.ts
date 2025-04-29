import { makeAutoObservable } from 'mobx';

import { RequestModel, type IRequestModel } from '~/models';
import { type IMessage, type IAuth } from '~/services';

import { type IViewerStore } from '../viewer';

export interface IAuthStore {
    signInWithGoogle: IRequestModel<[], boolean>;
    signInOut: IRequestModel;
    signUpWithEmail: IRequestModel<[string, string]>;
    signInWithEmail: IRequestModel<[string, string]>;
    signInAnonymously: IRequestModel;
    sendResetPassword: IRequestModel<[string]>;
    checkEmailVerificationStatus: IRequestModel;
}

interface IServices {
    message: IMessage;
    auth: IAuth;
}

interface IStores {
    viewer: IViewerStore;
}

export interface IAuthStoreParams {
    services: IServices;
    getStores: () => IStores;
}

export class AuthStore implements IAuthStore {
    services: IServices;
    getStores: () => IStores;

    constructor(params: IAuthStoreParams) {
        this.services = params.services;
        this.getStores = params.getStores;

        makeAutoObservable(this);
    }

    signInWithGoogle = new RequestModel({
        run: async () => {
            this.getStores().viewer.setLoading(true);
            const isNewUser = await this.services.auth.signInWithGoogle();
            await this.getStores().viewer.fetchCurrentUser.run();
            return isNewUser;
        },
    });

    signInOut = new RequestModel({
        run: () => this.services.auth.signOut(),
    });

    signUpWithEmail = new RequestModel({
        run: async (email: string, password: string) => {
            this.getStores().viewer.setLoading(true);
            await this.services.auth.createUserWithEmailAndPassword(email, password);
            await this.getStores().viewer.fetchCurrentUser.run();
        },
    });

    signInWithEmail = new RequestModel({
        run: async (email: string, password: string) => {
            this.getStores().viewer.setLoading(true);
            await this.services.auth.signInWithEmailAndPassword(email, password);
            await this.getStores().viewer.fetchCurrentUser.run();
        },
    });

    sendResetPassword = new RequestModel({
        run: async (email: string) => {
            this.getStores().viewer.setLoading(true);
            await this.services.auth.sendPasswordResetEmail(email);
        },
    });

    signInAnonymously = new RequestModel({
        run: async () => {
            await this.services.auth.signInAnonymously();
        },
    });

    checkEmailVerificationStatus = new RequestModel({
        run: async () => {
            try {
                await this.services.auth.checkEmailVerification();
                this.getStores().viewer.setAuthData(this.services.auth.currentUser());
            } catch (error) {
                // do not need to handle
            }
        },
    });
}
