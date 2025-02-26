import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_OBJECT_STATUS } from 'shared-my';
import {
    type IExplosiveDeviceStore,
    type IExplosiveObjectStore,
    ExplosiveDeviceStore,
    ExplosiveObjectStore,
    type IRequestModel,
    RequestModel,
    ExplosiveStore,
    type IExplosiveStore,
    type IBookStore,
    BookStore,
} from 'shared-my-client';

import { Api } from '~/api';
import { DB } from '~/db';
import { Analytics, Crashlytics, Logger, Message } from '~/services';

export interface IRootStore {
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;
    book: IBookStore;
    isInitialized: boolean;
    isLoaded: boolean;
    removeAllListeners(): void;
    init: IRequestModel;
    getImagesUrls(): string[];
}

export class RootStore implements IRootStore {
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;
    book: IBookStore;

    isLoaded = false;
    isInitialized = false;

    getStores = () => {
        return {
            viewer: undefined,
            explosive: this.explosive,
            explosiveDevice: this.explosiveDevice,
            explosiveObject: this.explosiveObject,
        };
    };

    get services() {
        return {
            analytics: Analytics,
            crashlytics: Crashlytics,
            logger: Logger,
            message: Message,
        };
    }

    get api() {
        return Api;
    }

    constructor() {
        this.explosive = new ExplosiveStore(this);
        this.explosiveDevice = new ExplosiveDeviceStore(this);
        this.explosiveObject = new ExplosiveObjectStore(this);
        this.book = new BookStore(this);

        makeAutoObservable(this);
    }

    setInitialized(value: boolean) {
        this.isInitialized = value;
    }

    removeAllListeners() {
        /**
         * Remove all listeners
         */
    }

    getImagesUrls() {
        const urls: string[] = [];

        this.explosiveObject.collection.asArray.forEach(item => {
            !!item?.data?.imageUri && urls.push(item?.data?.imageUri);
            urls.push(...(item.details?.data?.imageUris ?? []));
            urls.push(...(item.details?.data?.purpose?.imageUris ?? []));
            urls.push(...(item.details?.data?.structure?.imageUris ?? []));
            urls.push(...(item.details?.data?.action?.imageUris ?? []));
        });

        this.explosive.collection.asArray.forEach(item => {
            !!item?.data?.imageUri && urls.push(item?.data?.imageUri);
            urls.push(...(item?.data?.imageUris ?? []));
        });

        this.explosiveDevice.collection.asArray.forEach(item => {
            !!item?.data?.imageUri && urls.push(item?.data?.imageUri);
            urls.push(...(item?.data?.imageUris ?? []));
            urls.push(...(item?.data?.purpose?.imageUris ?? []));
            urls.push(...(item?.data?.structure?.imageUris ?? []));
            urls.push(...(item?.data?.action?.imageUris ?? []));
        });

        this.book.collection.asArray.forEach(item => {
            !!item?.data?.imageUri && urls.push(item?.data?.imageUri);
        });

        return urls;
    }

    init = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            this.services.analytics.init();
            this.services.crashlytics.init();

            try {
                await DB.init();
                await Promise.all([
                    this.explosiveObject.subscribe.run({
                        where: {
                            status: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
                        },
                    }),
                    this.explosiveObject.subscribeDeeps.run(),
                    this.explosiveDevice.subscribe.run(),
                    this.explosive.subscribe.run(),
                    this.book.subscribe.run(),
                ]);
            } catch (e) {
                /** SKIP */
            }
        },
    });
}
