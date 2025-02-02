import { makeAutoObservable } from 'mobx';

import { Modal } from '~/services';
import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { MODALS } from './constants';

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
        Modal.show(MODALS.LOADING);
        await stores.init.run();
        this.setInitialized(true);
        Modal.hide(MODALS.LOADING);
    }

    get isLoading() {
        return !!stores.init.isLoading;
    }
}

export const appViewModel = new AppViewModel();
