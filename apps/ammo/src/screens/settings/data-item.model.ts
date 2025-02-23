import { makeAutoObservable } from 'mobx';

import { type SCREENS } from '~/constants';
import { t } from '~/localization';
import { Navigation, Message } from '~/services';
import { externalLink } from '~/utils/url';

export interface IDataItem {
    id: string;
    title: string;
    press(): void;
}

export class DataItem implements IDataItem {
    constructor(
        public id: string,
        public params: {
            email?: string;
            screen?: SCREENS;
        },
    ) {
        makeAutoObservable(this);
    }

    async press() {
        if (this.params.email) {
            try {
                await externalLink.emailTo(this.params.email);
            } catch (error) {
                Message.error(t('error.can-not-open-link') as string);
            }
        }

        if (this.params.screen) {
            Navigation.push(this.params.screen);
        }
    }

    get title() {
        return this.id;
    }
}
