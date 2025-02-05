import { makeAutoObservable } from 'mobx';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IAppViewModel extends ViewModel {
    fetch(): Promise<void>;
}

export class AppViewModel implements IAppViewModel {
    constructor() {
        makeAutoObservable(this);
    }

    unmount() {
        stores.removeAllListeners();
    }

    async fetch() {
        await stores.init.run();
    }

    get isLoading() {
        return !!stores.init.isLoading;
    }
}

export const appViewModel = new AppViewModel();
