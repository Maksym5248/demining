import { makeAutoObservable } from 'mobx';
import { APPS } from 'shared-my';
import {
    ExplosiveDeviceStore,
    ExplosiveObjectStore,
    RequestModel,
    ExplosiveStore,
    BookStore,
    CommonStore,
    type IExplosiveDeviceStore,
    type IExplosiveObjectStore,
    type IRequestModel,
    type IExplosiveStore,
    type IBookStore,
    type IAuthUser,
    type ICommonStore,
    AuthStore,
    ViewerStore,
    createCurrentUser,
} from 'shared-my-client';

import { Api } from '~/api';
import { DB } from '~/db';
import { Localization } from '~/localization';
import { Analytics, Auth, Crashlytics, Logger, Message } from '~/services';

export interface IRootStore {
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;
    book: IBookStore;
    common: ICommonStore;
    isInitialized: boolean;
    isLoaded: boolean;
    init: IRequestModel;
    removeAllListeners(): void;
    getImagesUrls(): string[];
}

export class RootStore implements IRootStore {
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;
    book: IBookStore;
    common: ICommonStore;
    auth: AuthStore;
    viewer: ViewerStore;

    isLoaded = false;
    isInitialized = false;

    getStores = () => {
        return {
            viewer: this.viewer,
            explosive: this.explosive,
            explosiveDevice: this.explosiveDevice,
            explosiveObject: this.explosiveObject,
            common: this.common,
        };
    };

    get services() {
        return {
            analytics: Analytics,
            crashlytics: Crashlytics,
            logger: Logger,
            message: Message,
            auth: Auth,
            localization: Localization,
        };
    }

    get api() {
        return Api;
    }

    constructor() {
        this.auth = new AuthStore(this);
        this.viewer = new ViewerStore(this);

        this.common = new CommonStore(APPS.AMMO, this);
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
            urls.push(...(item.details?.data?.liquidator?.imageUris ?? []));
            urls.push(...(item.details?.data?.extraction?.imageUris ?? []));
            urls.push(...(item.details?.data?.folding?.imageUris ?? []));
            urls.push(...(item.details?.data?.installation?.imageUris ?? []));
            urls.push(...(item.details?.data?.marking?.imageUris ?? []));
            urls.push(...(item.details?.data?.historical?.imageUris ?? []));
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
            urls.push(...(item?.data?.usage?.imageUris ?? []));
        });

        this.book.collection.asArray.forEach(item => {
            !!item?.data?.imageUri && urls.push(item?.data?.imageUri);
        });

        return urls;
    }

    private async onChangeUser(user: IAuthUser | null) {
        try {
            this.services.analytics.setUserId(user?.uid ?? null);

            if (user) {
                this.viewer.setAuthData(user);
            }

            if (user && !user.isAnonymous) {
                const res = await this.api.currentUser.get(user.uid);
                if (res) this.viewer.setUser(createCurrentUser(res));
            }

            if (!user) {
                this.viewer.removeUser();
            }
        } catch (e) {
            this.services.logger.error(e);
            this.services.message.error('Bиникла помилка');
            this.viewer.removeUser();
        }

        this.viewer.setLoading(false);
    }

    init = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            await DB.init();
            this.api.setLang(this.services.localization.data.locale);

            this.services.auth.onAuthStateChanged(user => this.onChangeUser(user));
            this.services.auth.signInAnonymously();

            try {
                await Promise.all([
                    this.common.subscribeCountries.run(),
                    this.common.subscribeStatuses.run(),
                    this.common.subscribeMaterials.run(),
                    this.explosiveObject.subscribe.run(),
                    this.explosiveObject.subscribeDetails.run(),
                    this.explosiveObject.subscribeDeeps.run(),
                    this.explosiveDevice.subscribe.run(),
                    this.explosiveDevice.subscribeType.run(),
                    this.explosive.subscribe.run(),
                    this.book.subscribeBookType.run(),
                    this.book.subscribe.run(),
                ]);
            } catch (e) {
                /** SKIP */
            }
        },
    });
}
