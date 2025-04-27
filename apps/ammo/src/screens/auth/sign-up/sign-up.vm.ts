import { makeAutoObservable } from 'mobx';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS, SCREENS } from '~/constants';
import { ErrorManager, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

const validationSchema = validation.shape({
    email: validation.email,
    password: validation.password,
    confirmPassword: validation.confirmPassword,
});

interface SignUpForm {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ISignInVM extends ViewModel {
    form: IForm<SignUpForm>;
    signInWithGoogle: RequestModel;
}

export class SignUpVM implements ISignInVM {
    form: IForm<SignUpForm> = new Form({
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
            {
                name: 'confirmPassword',
                rules: 'confirmPassword',
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

                await stores.auth.signUpWithEmail.run(values.email, values.password);

                Modal.hide(MODALS.LOADING);
                Navigation.navigate(SCREENS.SETTINGS);
            } catch (e) {
                ErrorManager.form<SignUpForm>(this.form, e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });

    signInWithGoogle = new RequestModel({
        run: async () => {
            try {
                Modal.show(MODALS.LOADING);
                await stores.auth.signInWithGoogle.run();
            } catch (e) {
                ErrorManager.request(e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });
}

export const signUpVM = new SignUpVM();
