import { makeAutoObservable } from 'mobx';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS } from '~/constants';
import { t } from '~/localization';
import { Alert, ErrorManager, Message, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';
import { externalLink } from '~/utils';

const validationSchema = validation.shape({
    email: validation.email(),
});

interface ResetPasswordForm {
    email: string;
}

export interface IResetPasswordVM extends ViewModel {
    form: IForm<ResetPasswordForm>;
}

export class ResetPasswordVM implements IResetPasswordVM {
    form: IForm<ResetPasswordForm> = new Form({
        schema: validationSchema,
        fields: [
            {
                name: 'email',
                rules: 'email',
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
                await stores.auth.sendResetPassword.run(values.email);
                Navigation.goBack();
                Message.success(t('screens.reset-password.sendResetPasswordSuccess'));
                this.showAlert();
            } catch (e) {
                ErrorManager.form<ResetPasswordForm>(this.form, e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });

    showAlert = () => {
        Alert.show({
            title: t('screens.reset-password.alert.title'),
            subTitle: t('screens.reset-password.alert.text'),
            confirm: {
                title: t('screens.reset-password.alert.confirm'),
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

    unmount() {
        this.form.reset();
    }
}

export const resetPasswordVM = new ResetPasswordVM();
