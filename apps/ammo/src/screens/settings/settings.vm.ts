import { makeAutoObservable } from 'mobx';

import { CONFIG } from '~/config';
import { SCREENS } from '~/constants';
import { Debugger } from '~/services';
import { type ViewModel } from '~/types';

import { DataItem, type IDataItem } from './data-item.model';

export interface ISettingsVM extends ViewModel {
    asArray: IDataItem[];
}

export class SettingsVM implements ISettingsVM {
    isEnabledDebugger = Debugger.isEnabled;
    isVisibleButton = Debugger.isVisibleButton;

    constructor() {
        makeAutoObservable(this);
    }

    setEnabledDebugger(value: boolean) {
        this.isEnabledDebugger = value;
    }

    setVisibleButton(value: boolean) {
        this.isVisibleButton = value;
    }

    init() {
        Debugger.onChangeEnabled(value => {
            console.log('Debugger enabled', value);
            this.setEnabledDebugger(value);
        });

        Debugger.onChangeVisibleButton(value => {
            console.log('Debugger visible button', value);
            this.setVisibleButton(value);
        });
    }

    get asArray() {
        return [
            new DataItem('about', {
                screen: SCREENS.ABOUT,
            }),
            new DataItem('support', {
                email: CONFIG.SUPPORT_EMAIL,
            }),
            this.isEnabledDebugger
                ? new DataItem('debugger', {
                      toggle: () => {
                          if (Debugger.isVisibleButton) {
                              Debugger.hideButton();
                          } else {
                              Debugger.showButton();
                          }
                      },
                      isActive: this.isVisibleButton,
                  })
                : undefined,
        ].filter(Boolean) as IDataItem[];
    }
}

export const settingsVM = new SettingsVM();
