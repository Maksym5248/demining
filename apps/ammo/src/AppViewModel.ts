import { makeAutoObservable } from 'mobx';
import { type IRequestModel, Logger, LogLevel, RequestModel } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { CONFIG } from './config';
import { STORAGE } from './constants';
import { Localization } from './localization';
import { Analytics, AppState, Auth, BookCache, Crashlytics, Debugger, ImageChahe, LocalStore, NetInfo } from './services';
import { ThemeManager } from './styles';
import { type IUpdaterModel, UpdaterModel } from './UpdaterModel';
import { Device } from './utils';

export interface IAppViewModel extends ViewModel {
    animationFinished(): void;
    isVisibleSplash: boolean;
    initialization: IRequestModel;
}

export class AppViewModel implements IAppViewModel {
    isVisibleSplash = true;

    updater: IUpdaterModel = new UpdaterModel();

    constructor() {
        makeAutoObservable(this);
    }

    initSession = () => {
        const currentNumber = LocalStore.getNumber(STORAGE.SESSION_NUMBER) ?? 0;
        const newSessionNumber = currentNumber + 1;
        LocalStore.set(STORAGE.SESSION_NUMBER, newSessionNumber);
        Analytics.setSession(newSessionNumber);
    };

    initDebuger = () => {
        Logger.enable();
        Debugger.init(true);

        Logger.setLevel(LogLevel.Debug);
        Logger.log('VERSION: ', Device.appInfo);
        Logger.log('SESSION: ', LocalStore.getNumber(STORAGE.SESSION_NUMBER));
        Logger.log('LOCALE: ', Localization.data.locale);
        Logger.log('USER ID: ', Auth.uuid());
    };

    animationFinished = () => {
        this.isVisibleSplash = false;
    };

    unmount() {
        Logger.log('UNMOUNT');

        stores.removeAllListeners();
        AppState.removeAllListeners();
        NetInfo.removeAllListeners();
        ThemeManager.removeAllListeners();
        Localization.removeAllListeners();
        Debugger.removeAllListeners();
        this.isVisibleSplash = true;
    }

    initConfig = async () => {
        const { appConfig } = stores.common;
        appConfig.setPlatform(Device.platform);

        await stores.common.fetchAppConfig.run();
        this.updater.checkUpdates.run();

        if (appConfig.checkDebugger(Auth.uuid()) || CONFIG.IS_DEBUG) {
            this.initDebuger();
        }
    };

    initialization = new RequestModel({
        run: async () => {
            try {
                this.initSession();

                AppState.init();
                Analytics.init();
                Analytics.setUserId(Auth.uuid());
                Crashlytics.init();
                stores.auth.checkEmailVerificationStatus.run();

                await Promise.allSettled([NetInfo.init(), Localization.init(), ImageChahe.init(), BookCache.init()]);
                AppState.onChange(state => {
                    if (state === 'active') {
                        NetInfo.pingInfo();
                        stores.auth.checkEmailVerificationStatus.run();
                    }

                    Logger.log('APP STATE', state);
                });

                await stores.init.run();

                setTimeout(() => {
                    this.initConfig();
                }, 0);
                NetInfo.onChange(info => {
                    info.isConnected && this.updater.preloadImages.run();
                });
            } catch (error) {
                Logger.error(error);
            }
        },
    });
}

export const appViewModel = new AppViewModel();
