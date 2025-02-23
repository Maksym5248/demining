import { makeAutoObservable } from 'mobx';
import { type IRequestModel, RequestModel } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { ImageChache } from './services';

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
            await ImageChache.preload(stores.getImagesUrls());
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
