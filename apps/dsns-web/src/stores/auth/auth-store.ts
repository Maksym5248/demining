import { message } from 'antd';
import { makeAutoObservable } from 'mobx';

import { IAuthService } from '~/services';
import { IRequestModel, RequestModel } from '~/utils/models';

export interface IAuthStore {
    signInWithGoogle: IRequestModel;
    signInOut: IRequestModel;
    signUpWithEmail: IRequestModel<[string, string]>;
    signInWithEmail: IRequestModel<[string, string]>;
}
export interface IAuthStoreParams {
    services: {
        auth: IAuthService;
    };
}

export class AuthStore implements IAuthStore {
    services: {
        auth: IAuthService;
    };

    signInWithGoogle = new RequestModel({
        run: () => this.services.auth.signInWithGoogle(),
        onError: () => message.error('Не вдалось увійти, спробуйте ще раз'),
    });

    signInOut = new RequestModel({
        run: () => this.services.auth.signOut(),
        onError: () => message.error('Не вдалось вийти, спробуйте ще раз'),
    });

    signUpWithEmail = new RequestModel({
        run: (email: string, password: string) => this.services.auth.createUserWithEmailAndPassword(email, password),
        onError: () => message.error('Не вдалось зареєструватись, спробуйте ще раз'),
    });

    signInWithEmail = new RequestModel({
        run: (email: string, password: string) => this.services.auth.signInWithEmailAndPassword(email, password),
        onError: () => message.error('Не вдалось вийти, спробуйте ще раз'),
    });

    constructor(params: IAuthStoreParams) {
        this.services = params.services;

        makeAutoObservable(this);
    }
}
