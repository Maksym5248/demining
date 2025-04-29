import { makeAutoObservable } from 'mobx';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS } from '~/constants';
import { t } from '~/localization';
import { ErrorManager, Message, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

interface IProfileForm {
    name: string;
    photoUri?: string;
}

export interface IProfileVM extends ViewModel {
    form: IForm<IProfileForm>;
}

export class ProfileVM implements IProfileVM {
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

    init() {
        console.log('ProfileVM init', stores.viewer.user?.data);
        this.form.setValues({
            name: stores.viewer.user?.data.info?.name ?? '',
            photoUri: stores.viewer.user?.data?.info?.photoUri ?? undefined,
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

                await stores.viewer.user?.updateInfo.run(values);

                Modal.hide(MODALS.LOADING);
                Message.success(t('message.updatedSuccess'));
                Navigation.goBack();
            } catch (e) {
                ErrorManager.form<IProfileForm>(this.form, e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });
}

export const profileVM = new ProfileVM();
