import { makeAutoObservable } from 'mobx';
import { type IRequestModel, RequestModel } from 'shared-my-client';

import { CONFIG } from '~/config';
import { SCREENS } from '~/constants';
import { t } from '~/localization';
import { Debugger, Navigation, Alert } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { DataItem, type IDataItem } from './data-item.model';

export interface ISettingsVM extends ViewModel {
    asArray: IDataItem[];
    uri?: string;
    userName?: string;
    isAuthenticated: boolean;
    openSignIn: () => void;
    signOut: IRequestModel;
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

    openSignIn() {
        Navigation.navigate(SCREENS.SIGN_IN);
    }

    signOut = new RequestModel({
        run: () => {
            Alert.show({
                title: t('screens.settings.alert.title'),
                subTitle: t('screens.settings.alert.subTitle'),
                isVisibleLoading: true,
                confirm: {
                    run: () => stores.auth.signInOut.run(),
                },
            });
        },
    });

    get uri() {
        return stores.viewer.user?.data?.info?.photoUri ?? undefined;
    }

    get userName() {
        return stores.viewer.user?.displayName;
    }

    get isAuthenticated() {
        return stores.viewer.isAuthenticated;
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
