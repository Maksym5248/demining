import { makeAutoObservable } from 'mobx';
import { validation } from 'shared-my-client';

import { MODALS } from '~/constants';
import { Message, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';
import { Form, type IForm } from '~/utils';

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
                    Navigation.goBack();
                } catch (e) {
                    Message.error('Не вдалось зареєструватись, спробуйте ще раз');
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
