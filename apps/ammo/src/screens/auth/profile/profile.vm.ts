import { makeAutoObservable } from 'mobx';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS } from '~/constants';
import { t } from '~/localization';
import { Alert, ErrorManager, Message, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';
import { externalLink } from '~/utils';

interface IProfileForm {
    name: string;
    photoUri?: string;
}

export interface IProfileVM extends ViewModel {
    form: IForm<IProfileForm>;
}

export class ProfileVM implements IProfileVM {
    params: { isRegistration?: boolean } = {
        isRegistration: false,
    };

    form: IForm<IProfileForm> = new Form({
        schema: validation.shape({
            name: validation.name(),
            photoUri: validation.uri(),
        }),
        fields: [
            {
                name: 'name',
                rules: 'name',
            },
            {
                name: 'photoUri',
                rules: 'photoUri',
            },
        ],
        submit: {
            onSubmit: () => this.submit.run(),
        },
    });

    constructor() {
        makeAutoObservable(this);
    }

    init(params?: { isRegistration?: boolean }) {
        this.params.isRegistration = params?.isRegistration ?? false;

        this.form.setValues({
            name: stores.viewer.user?.data.info?.name ?? '',
            photoUri: stores.viewer.user?.data?.info?.photoUri ?? '',
        });
    }

    unmount() {
        this.form.reset();
    }

    submit = new RequestModel({
        run: async () => {
            try {
                Modal.show(MODALS.LOADING);
                const values = this.form.values();

                await stores.viewer.user?.updateInfo.run({
                    name: values.name,
                    photoUri: values.photoUri || undefined,
                });

                Modal.hide(MODALS.LOADING);
                Message.success(t('message.updatedSuccess'));

                if (this.params.isRegistration) {
                    this.showAlert();
                }

                Navigation.goBack();
            } catch (e) {
                ErrorManager.form<IProfileForm>(this.form, e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });

    showAlert = () => {
        Alert.show({
            title: t('screens.sign-up.alertEmailVerification.title'),
            subTitle: t('screens.sign-up.alertEmailVerification.text'),
            confirm: {
                title: t('screens.sign-up.alertEmailVerification.confirm'),
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
}

export const profileVM = new ProfileVM();
