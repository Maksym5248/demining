import { makeAutoObservable } from 'mobx';

import { RequestModel, type IRequestModel } from '~/models';
import { type IMessage, type IAuth } from '~/services';

import { type IViewerStore } from '../viewer';

export interface IAuthStore {
    signInWithGoogle: IRequestModel;
    signInOut: IRequestModel;
    signUpWithEmail: IRequestModel<[string, string]>;
    signInWithEmail: IRequestModel<[string, string]>;
    signInAnonymously: IRequestModel;
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
            await this.services.auth.signInWithGoogle();
        },
        onError: () => this.services.message.error('Не вдалось увійти, спробуйте ще раз'),
    });

    signInOut = new RequestModel({
        run: () => this.services.auth.signOut(),
        onError: () => this.services.message.error('Не вдалось вийти, спробуйте ще раз'),
    });

    signUpWithEmail = new RequestModel({
        run: async (email: string, password: string) => {
            this.getStores().viewer.setLoading(true);
            await this.services.auth.createUserWithEmailAndPassword(email, password);
        },
        onError: () => this.services.message.error('Не вдалось зареєструватись, спробуйте ще раз'),
    });

    signInWithEmail = new RequestModel({
        run: async (email: string, password: string) => {
            this.getStores().viewer.setLoading(true);
            await this.services.auth.signInWithEmailAndPassword(email, password);
        },
        onError: () => this.services.message.error('Не вдалось вийти, спробуйте ще раз'),
    });

    signInAnonymously = new RequestModel({
        run: async () => {
            await this.services.auth.signInAnonymously();
        },
        onError: () => this.services.message.error('Не вдалось вийти, спробуйте ще раз'),
    });
}
