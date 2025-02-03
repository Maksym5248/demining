import { makeAutoObservable } from 'mobx';

import { stores } from '~/stores';
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

    unmount() {
        stores.removeAllListeners();
    }

    setInitialized(value: boolean) {
        this.isInitialized = value;
    }

    async fetch() {
        await stores.init.run();
        this.setInitialized(true);
    }

    get isLoading() {
        return !!stores.init.isLoading;
    }
}

export const appViewModel = new AppViewModel();
