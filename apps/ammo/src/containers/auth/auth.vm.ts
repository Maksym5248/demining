import { makeAutoObservable } from 'mobx';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IAuthVM extends ViewModel {
    isAuthenticated: boolean;
    isRegistered: boolean;
    isEmailVerified: boolean;
    openAutentication: () => void;
}

export class AuthVM implements IAuthVM {
    constructor() {
        makeAutoObservable(this);
    }

    openAutentication() {
        Navigation.navigate(SCREENS.SIGN_UP);
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
