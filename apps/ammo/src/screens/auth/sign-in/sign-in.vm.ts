import { makeAutoObservable } from 'mobx';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS } from '~/constants';
import { ErrorManager, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

const validationSchema = validation.shape({
    email: validation.email,
    password: validation.password,
});

interface SignInForm {
    email: string;
    password: string;
}

export interface ISignInVM extends ViewModel {
    form: IForm<SignInForm>;
    signInWithGoogle: RequestModel;
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
                Navigation.goBack();
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
                await stores.auth.signInWithGoogle.run();
                Navigation.goBack();
            } catch (e) {
                ErrorManager.request(e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });

    unmount() {
        this.form.reset();
    }
}

export const signInVM = new SignInVM();
