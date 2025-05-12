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
    ErrorModel,
    CommentStore,
    type ICommentStore,
    type IUserStore,
    UserStore,
    ComplainStore,
    type IComplainStore,
} from 'shared-my-client';

import { Api } from '~/api';
import { Localization } from '~/localization';
import { Analytics, Auth, Crashlytics, ErrorManager, Logger, Message } from '~/services';

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
    comment: ICommentStore;
    user: IUserStore;
    complain: IComplainStore;

    isLoaded = false;
    isInitialized = false;

    getStores = () => {
        return {
            viewer: this.viewer,
            explosive: this.explosive,
            explosiveDevice: this.explosiveDevice,
            explosiveObject: this.explosiveObject,
            common: this.common,
            book: this.book,
            auth: this.auth,
            comment: this.comment,
            user: this.user,
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
        this.user = new UserStore(this);
        this.comment = new CommentStore(this);
        this.complain = new ComplainStore(this);

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
            Logger.log('AUTH_STATE_CHANGED');
            Logger.log('ANONIM ', user?.isAnonymous);
            Logger.log('VERIFIED_EMAIL ', user?.emailVerified);

            this.services.analytics.setUserId(user?.uid ?? null);
            this.viewer.setAuthData(user);

            if (user && !user.isAnonymous) {
                await this.viewer.fetchCurrentUser.run();
            }

            if (!user) {
                this.viewer.removeUser();
            }
        } catch (e) {
            const error = new ErrorModel(e as Error);
            ErrorManager.request(error);
            this.viewer.removeUser();
        }

        this.viewer.setLoading(false);
    }

    async sync() {
        await Promise.all([
            this.common.syncCountries.run(),
            this.common.syncStatuses.run(),
            this.common.syncMaterials.run(),
            this.explosiveObject.sync.run(),
            this.explosiveObject.syncDetails.run(),
            this.explosiveObject.syncDeeps.run(),
            this.explosiveDevice.sync.run(),
            this.explosiveDevice.syncType.run(),
            this.explosive.sync.run(),
            this.book.syncBookType.run(),
            this.book.sync.run(),
        ]);
    }

    init = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            try {
                await this.api.init();
                this.api.setLang(this.services.localization.data.locale);

                this.services.auth.onAuthStateChanged(user => this.onChangeUser(user));

                if (!this.services.auth.uuid()) {
                    this.services.auth.signInAnonymously();
                }

                await this.sync();
            } catch (e) {
                this.services.crashlytics.error('Init', e);
            }
        },
    });
}
