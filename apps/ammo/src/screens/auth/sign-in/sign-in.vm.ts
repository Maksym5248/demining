import { makeAutoObservable } from 'mobx';

import { type ViewModel } from '~/types';

export interface ISignInVM extends ViewModel {}

export class SignInVM implements ISignInVM {
    constructor() {
        makeAutoObservable(this);
    }
}

export const signInVM = new SignInVM();
