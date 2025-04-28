import { makeAutoObservable } from 'mobx';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IAuthVM extends ViewModel {
    isAuthenticated: boolean;
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
}

export const authVM = new AuthVM();
