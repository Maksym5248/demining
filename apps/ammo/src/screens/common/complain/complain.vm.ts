import { makeAutoObservable } from 'mobx';
import { COMPLAIN_TYPE } from 'shared-my';
import { Form, type IForm, RequestModel, validation } from 'shared-my-client';

import { MODALS } from '~/constants';
import { t } from '~/localization';
import { ErrorManager, Message, Modal, Navigation } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { type IComplainParams } from './complain.types';

interface IComplainForm {
    text: string;
}

export interface IComplainVM extends ViewModel {
    form: IForm<IComplainForm>;
}

export class ComplainVM implements IComplainVM {
    params: IComplainParams = {
        type: COMPLAIN_TYPE.COMMENT,
        entityId: '',
    };

    form: IForm<IComplainForm> = new Form({
        schema: validation.shape({
            text: validation.required(),
        }),
        fields: [
            {
                name: 'text',
                rules: 'required',
            },
        ],
        submit: {
            onSubmit: () => this.submit.run(),
        },
    });

    constructor() {
        makeAutoObservable(this);
    }

    init(params: IComplainParams) {
        this.params.type = params.type;
        this.params.entityId = params.entityId;
    }

    unmount() {
        this.form.reset();
        this.params = {
            type: COMPLAIN_TYPE.COMMENT,
            entityId: '',
        };
    }

    submit = new RequestModel({
        run: async () => {
            try {
                Modal.show(MODALS.LOADING);
                const values = this.form.values();

                console.log('values', {
                    text: values.text,
                    type: this.params.type,
                    entityId: this.params.entityId,
                });

                await stores.complain.create.run({
                    text: values.text,
                    type: this.params.type,
                    entityId: this.params.entityId,
                });

                Message.success(t('screens.complain.sendSuccess'));
                Navigation.goBack();
            } catch (e) {
                ErrorManager.form<IComplainForm>(this.form, e);
            } finally {
                Modal.hide(MODALS.LOADING);
            }
        },
    });
}

export const complainVM = new ComplainVM();
