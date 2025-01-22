import { makeAutoObservable } from 'mobx';
import { LogLevel } from 'shared-my-client';

import { CONFIG } from '~/config';
import { Logger } from '~/services';
import { stores } from '~/stores';
import { ThemeManager } from '~/styles';
import { type ViewModel } from '~/types';

export interface IAppViewModel extends ViewModel {
    isInitialized: boolean;
    isLoading: boolean;
    fetch(): void;
}

export class AppViewModel implements IAppViewModel {
    isInitialized = false;

    constructor() {
        makeAutoObservable(this);
    }

    setInitialized(value: boolean) {
        this.isInitialized = value;
    }

    async fetch() {
        CONFIG.IS_DEBUG && Logger.enable();
        Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);
        ThemeManager.removeAllListeners();
        await stores.init.run();
        this.setInitialized(true);
    }

    get isLoading() {
        return !!stores.init.isLoading;
    }

    unmount() {
        ThemeManager.removeAllListeners();
        stores.removeAllListeners();
    }
}

export const appViewModel = new AppViewModel();
