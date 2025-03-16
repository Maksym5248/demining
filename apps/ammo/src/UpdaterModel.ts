import { makeAutoObservable } from 'mobx';
import { type IRequestModel, Logger, RequestModel } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { Localization } from './localization';
import { ImageChahe, Updater } from './services';
import { Device } from './utils';

export interface IUpdaterModel extends ViewModel {
    checkUpdates: IRequestModel;
    preloadImages: IRequestModel;
}

const SIENTLY_LOADING_IMAGES_NUMBER = -1;

export class UpdaterModel implements IUpdaterModel {
    isVisibleSplash = true;

    constructor() {
        makeAutoObservable(this);
    }

    checkUpdates = new RequestModel({
        run: async () => {
            const { appConfig } = stores.common;
            appConfig.setPlatform(Device.platform);

            await stores.common.fetchAppConfig.run();

            if (!stores.common.appConfig.isAvalibaleUpdate(Device.version)) return;

            if (appConfig.force) {
                Updater.forced({
                    title: Localization.t('updates.app-force.title'),
                    text: Localization.t('updates.app-force.text'),
                    link: appConfig.link,
                });
            } else {
                Updater.optional({
                    title: Localization.t('updates.app-optional.title'),
                    text: Localization.t('updates.app-optional.text'),
                    link: appConfig.link,
                });
            }
        },
    });

    preloadImages = new RequestModel({
        returnIfLoaded: true,
        run: async () => {
            const uris = stores.getImagesUrls();
            const unsavedUrls = await ImageChahe.filterUnsaved(uris);

            Logger.log(`FileSystem dir (${ImageChahe.dir}): `, uris.length);
            Logger.log(`FileSystem dir (${ImageChahe.dir}) unsaved: `, unsavedUrls.length);

            if (!unsavedUrls.length) return;

            if (unsavedUrls.length > SIENTLY_LOADING_IMAGES_NUMBER) {
                Updater.optional({
                    title: Localization.t('updates.dictionaries.title'),
                    text: Localization.t('updates.dictionaries.text'),
                    onLoad: () => ImageChahe.downloadMany(unsavedUrls),
                });
            } else {
                ImageChahe.downloadMany(unsavedUrls);
            }
        },
    });
}
