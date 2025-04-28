import { makeAutoObservable } from 'mobx';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS, SCREENS } from '~/constants';
import { t } from '~/localization';
import { Alert, ErrorManager, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';
import { externalLink } from '~/utils';

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
        schema: validation.shape({
            email: validation.email(),
            password: validation.password(),
            confirmPassword: validation.confirmPassword(() => {
                return this.form.field('password')?.value;
            }),
        }),
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

    unmount() {
        this.form.reset();
    }

    submit = new RequestModel({
        run: async () => {
            try {
                Modal.show(MODALS.LOADING);
                const values = this.form.values();

                await stores.auth.signUpWithEmail.run(values.email, values.password);

                Modal.hide(MODALS.LOADING);
                this.showAlert();
                Navigation.goBack();
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
                this.showAlert();
                Navigation.goBack();
            } catch (e) {
                ErrorManager.request(e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });

    showAlert = () => {
        Alert.show({
            title: t('screens.settings.alertEmailVerification.title'),
            subTitle: t('screens.settings.emailVerification.text'),
            confirm: {
                title: t('screens.settings.alertEmailVerification.confirm'),
                run: async () => {
                    try {
                        await externalLink.emailApp();
                    } catch (e) {
                        ErrorManager.request(e);
                    }
                },
            },
        });
    };

    openSignIn = () => {
        Navigation.navigate(SCREENS.SIGN_IN);
    };
}

export const signUpVM = new SignUpVM();
