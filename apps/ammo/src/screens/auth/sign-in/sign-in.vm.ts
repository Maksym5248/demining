import { makeAutoObservable } from 'mobx';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS, SCREENS } from '~/constants';
import { ErrorManager, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

const validationSchema = validation.shape({
    email: validation.email(),
    password: validation.password(),
});

interface SignInForm {
    email: string;
    password: string;
}

export interface ISignInVM extends ViewModel {
    form: IForm<SignInForm>;
    signInWithGoogle: RequestModel;
    openSignUp: () => void;
}

export class SignInVM implements ISignInVM {
    form: IForm<SignInForm> = new Form({
        schema: validationSchema,
        fields: [
            {
                name: 'email',
                rules: 'email',
            },
            {
                name: 'password',
                rules: 'password',
                type: 'password',
            },
        ],
        submit: {
            onSubmit: () => this.submit.run(),
        },
    });

    constructor() {
        makeAutoObservable(this);
    }

    submit = new RequestModel({
        run: async () => {
            try {
                Modal.show(MODALS.LOADING);
                const values = this.form.values();
                await stores.auth.signInWithEmail.run(values.email, values.password);
                Navigation.goBack(-2);
            } catch (e) {
                ErrorManager.form<SignInForm>(this.form, e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });

    signInWithGoogle = new RequestModel({
        run: async () => {
            try {
                Modal.show(MODALS.LOADING);
                const isNewUser = await stores.auth.signInWithGoogle.run();

                if (isNewUser) {
                    Navigation.goBack();
                    Navigation.replace(SCREENS.PROFILE);
                } else {
                    Navigation.goBack(-2);
                }
            } catch (e) {
                ErrorManager.request(e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });

    openSignUp = () => {
        Navigation.navigate(SCREENS.SIGN_UP);
    };

    unmount() {
        this.form.reset();
    }
}

export const signInVM = new SignInVM();
