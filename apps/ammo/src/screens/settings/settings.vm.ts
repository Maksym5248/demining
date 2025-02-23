import { makeAutoObservable } from 'mobx';

import { CONFIG } from '~/config';
import { SCREENS } from '~/constants';
import { type ViewModel } from '~/types';

import { DataItem, type IDataItem } from './data-item.model';

export interface ISettingsVM extends ViewModel {
    asArray: IDataItem[];
}

export class SettingsVM implements ISettingsVM {
    constructor() {
        makeAutoObservable(this);
    }

    get asArray() {
        return [
            new DataItem('about', {
                screen: SCREENS.ABOUT,
            }),
            new DataItem('support', {
                email: CONFIG.SUPPORT_EMAIL,
            }),
        ];
    }
}

export const settingsVM = new SettingsVM();
