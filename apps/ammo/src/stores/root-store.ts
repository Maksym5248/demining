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
} from 'shared-my-client';

import { Api } from '~/api';
import { DB } from '~/db';
import { Analytics, Crashlytics, Logger, Message } from '~/services';

export interface IRootStore {
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;
    isInitialized: boolean;
    isLoaded: boolean;
    removeAllListeners(): void;
    init: IRequestModel;
}

export class RootStore implements IRootStore {
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;

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
                ]);
            } catch (e) {
                /** SKIP */
            }
        },
    });
}
