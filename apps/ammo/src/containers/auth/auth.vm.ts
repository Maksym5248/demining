import { makeAutoObservable } from 'mobx';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IAuthVM extends ViewModel {
    isAuthenticated: boolean;
    isRegistered: boolean;
    isEmailVerified: boolean;
    openSignIn: () => void;
}

export class AuthVM implements IAuthVM {
    constructor() {
        makeAutoObservable(this);
    }

    openSignIn() {
        Navigation.navigate(SCREENS.SIGN_IN);
    }

    get isAuthenticated() {
        return !!stores.viewer.isAuthenticated;
    }

    get isRegistered() {
        return !!stores.viewer.isRegistered;
    }

    get isEmailVerified() {
        return !!stores.viewer.isEmailVerified;
    }
}

export const authVM = new AuthVM();
