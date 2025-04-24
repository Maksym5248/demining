import { makeAutoObservable } from 'mobx';
import { validation } from 'shared-my-client';

import { MODALS } from '~/constants';
import { Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';
import { Form, type IForm } from '~/utils';

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
            onSubmit: async form => {
                Modal.show(MODALS.LOADING);
                const values = form.values();
                await stores.auth.signInWithEmail.run(values.email, values.password);
            },
            onSuccess: () => {
                Modal.hide(MODALS.LOADING);
                Navigation.goBack();
            },
            onError: () => {
                Modal.hide(MODALS.LOADING);
            },
        },
    });

    constructor() {
        makeAutoObservable(this);
    }

    unmount() {
        this.form.reset();
    }
}

export const signInVM = new SignInVM();
