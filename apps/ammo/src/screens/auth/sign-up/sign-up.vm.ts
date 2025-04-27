import { makeAutoObservable } from 'mobx';
import { ErrorModel, Form, type IForm, validation } from 'shared-my-client';

import { MODALS, SCREENS } from '~/constants';
import { Message, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

const validationSchema = validation.shape({
    email: validation.email,
    password: validation.password,
});

interface SignUpForm {
    email: string;
    password: string;
}

export interface ISignInVM extends ViewModel {
    form: IForm<SignUpForm>;
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
        ],
        submit: {
            onSubmit: async form => {
                try {
                    Modal.show(MODALS.LOADING);
                    const values = form.values();

                    await stores.auth.signUpWithEmail.run(values.email, values.password);

                    Modal.hide(MODALS.LOADING);
                    Navigation.navigate(SCREENS.SETTINGS);
                } catch (e) {
                    const error = new ErrorModel(e);

                    this.form.setErrors(error);

                    if (!error.isFieldError && error.message) {
                        Message.error(error.message);
                    }
                } finally {
                    Modal.hide(MODALS.LOADING);
                }
            },
        },
    });

    constructor() {
        makeAutoObservable(this);
    }
}

export const signUpVM = new SignUpVM();
