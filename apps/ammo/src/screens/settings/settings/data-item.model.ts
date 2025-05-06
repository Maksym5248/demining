import { makeAutoObservable } from 'mobx';
import { ERROR_MESSAGE } from 'shared-my';

import { type SCREENS } from '~/constants';
import { tError } from '~/localization';
import { Navigation, Message } from '~/services';
import { externalLink } from '~/utils/url';

export interface IDataItem {
    id: string;
    title: string;
    isActive: boolean;
    press(): void;
}

export class DataItem implements IDataItem {
    constructor(
        public id: string,
        public params: {
            email?: string;
            screen?: SCREENS;
            toggle?: () => void;
            isActive?: boolean;
        },
    ) {
        makeAutoObservable(this);
    }

    get isActive() {
        return !!this.params.isActive;
    }

    async press() {
        if (this.params.toggle) {
            this.params.toggle();
        }

        if (this.params.email) {
            try {
                await externalLink.emailTo(this.params.email);
            } catch (error) {
                Message.error(tError(ERROR_MESSAGE.CAN_NOT_OPEN_LINK));
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
