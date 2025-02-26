import { makeAutoObservable } from 'mobx';
import { type IRequestModel, RequestModel } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { mageChahe } from './services';

export interface IAppViewModel extends ViewModel {
    fetch: IRequestModel;
    preloadImages: IRequestModel;
}

export class AppViewModel implements IAppViewModel {
    constructor() {
        makeAutoObservable(this);
    }

    unmount() {
        stores.removeAllListeners();
    }

    preloadImages = new RequestModel({
        returnIfLoaded: true,
        run: async () => {
            await mageChahe.preload(stores.getImagesUrls());
        },
    });

    fetch = new RequestModel({
        run: async () => {
            await stores.init.run();
        },
    });

    get isLoading() {
        return !!stores.init.isLoading;
    }
}

export const appViewModel = new AppViewModel();
