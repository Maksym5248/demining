import { makeAutoObservable } from 'mobx';

import { RequestModel, type IRequestModel } from '~/models';
import { type IMessage, type IAuth } from '~/services';

export interface IAuthStore {
    signInWithGoogle: IRequestModel;
    signInOut: IRequestModel;
    signUpWithEmail: IRequestModel<[string, string]>;
    signInWithEmail: IRequestModel<[string, string]>;
}

interface IServices {
    message: IMessage;
    auth: IAuth;
}
export interface IAuthStoreParams {
    services: IServices;
}

export class AuthStore implements IAuthStore {
    services: IServices;

    signInWithGoogle = new RequestModel({
        run: () => this.services.auth.signInWithGoogle(),
        onError: () => this.services.message.error('Не вдалось увійти, спробуйте ще раз'),
    });

    signInOut = new RequestModel({
        run: () => this.services.auth.signOut(),
        onError: () => this.services.message.error('Не вдалось вийти, спробуйте ще раз'),
    });

    signUpWithEmail = new RequestModel({
        run: (email: string, password: string) => this.services.auth.createUserWithEmailAndPassword(email, password),
        onError: () => this.services.message.error('Не вдалось зареєструватись, спробуйте ще раз'),
    });

    signInWithEmail = new RequestModel({
        run: (email: string, password: string) => this.services.auth.signInWithEmailAndPassword(email, password),
        onError: () => this.services.message.error('Не вдалось вийти, спробуйте ще раз'),
    });

    // TODO: remove this method
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test() {}

    constructor(params: IAuthStoreParams) {
        this.services = params.services;

        makeAutoObservable(this);
    }
}
