import { makeAutoObservable } from 'mobx';
import { type IRequestModel, Logger, LogLevel, RequestModel } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { CONFIG } from './config';
import { STORAGE } from './constants';
import { Localization } from './localization';
import { Analytics, AppState, BookCache, ImageChahe, LocalStorage, NetInfo } from './services';
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
        const currentNumber = LocalStorage.getNumber(STORAGE.SESSION_NUMBER) ?? 0;
        const newSessionNumber = currentNumber + 1;
        LocalStorage.set(STORAGE.SESSION_NUMBER, newSessionNumber);
        Logger.log('SESSION:', newSessionNumber);
        Analytics.setSession(newSessionNumber);
    };

    initDebuger = () => {
        CONFIG.IS_DEBUG && Logger.enable();
        Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);
        Logger.log('VERSION:', Device.appInfo);
    };

    animationFinished = () => {
        this.isVisibleSplash = false;
    };

    unmount() {
        stores.removeAllListeners();
        AppState.removeAllListeners();
        NetInfo.removeAllListeners();
        ThemeManager.removeAllListeners();
        Localization.removeAllListeners();
    }

    initialization = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            this.initDebuger();
            this.initSession();

            try {
                AppState.init();

                await Promise.allSettled([NetInfo.init(), Localization.init(), ImageChahe.init(), BookCache.init()]);
                AppState.onChange(state => {
                    if (state === 'active') {
                        NetInfo.pingInfo();
                    }
                });

                await stores.init.run();

                setTimeout(() => this.updater.checkUpdates.run(), 0);
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
