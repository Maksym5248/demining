import { makeAutoObservable } from 'mobx';
import { type IRequestModel, Logger, LogLevel, RequestModel } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { CONFIG } from './config';
import { PERMISSIONS, SCREENS, STORAGE } from './constants';
import { Localization } from './localization';
import {
    Analytics,
    AppState,
    Auth,
    BookCache,
    Crashlytics,
    Debugger,
    ImageChahe,
    LocalStore,
    Navigation,
    NetInfo,
    Permissions,
} from './services';
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
        Logger.log('PERMISSIONS.PHOTO_LIBRARY: ', Permissions.getStatus(PERMISSIONS.PHOTO_LIBRARY));

        Object.keys(CONFIG).forEach(key => {
            Logger.log('CONFIG: ', `${key} - ${CONFIG[key as keyof typeof CONFIG]}`);
        });
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
        Permissions.removeAllListeners();

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

                AppState.onChange(state => {
                    Logger.log('APP STATE', state);
                    if (state === 'active') {
                        NetInfo.pingInfo();
                        Permissions.checkAllStatuses();
                        stores.auth.checkEmailVerificationStatus.run();
                    }
                });

                NetInfo.onChange(info => {
                    info.isConnected && this.updater.preloadImages.run();
                });

                AppState.init();
                Analytics.init();
                Analytics.setUserId(Auth.uuid());
                Crashlytics.init();
                stores.auth.checkEmailVerificationStatus.run();

                await Promise.allSettled([NetInfo.init(), Localization.init(), ImageChahe.init(), BookCache.init(), Permissions.init()]);

                await stores.init.run();
                Navigation.navigate(SCREENS.EXPLOSIVE_OBJECT_DETAILS);
                setTimeout(() => {
                    this.initConfig();
                }, 0);
            } catch (error) {
                Logger.error(error);
            }
        },
    });
}

export const appViewModel = new AppViewModel();
