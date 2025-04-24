import { makeAutoObservable } from 'mobx';
import { validation } from 'shared-my-client';

import { type ViewModel } from '~/types';
import { Form, type IForm } from '~/utils';

const validationSchema = validation.shape({
    email: validation.email,
    password: validation.password,
});

export interface ISignInVM extends ViewModel {
    form: IForm;
}

export class SignInVM implements ISignInVM {
    form = new Form({
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
    });

    constructor() {
        makeAutoObservable(this);
    }
}

export const signInVM = new SignInVM();
