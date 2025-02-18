import { makeAutoObservable } from 'mobx';
import { type IRequestModel, RequestModel } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IAppViewModel extends ViewModel {
    fetch: IRequestModel;
}

export class AppViewModel implements IAppViewModel {
    constructor() {
        makeAutoObservable(this);
    }

    unmount() {
        stores.removeAllListeners();
    }

    // async fetch() {
    //     await stores.init.run();
    // }

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
