import { initializeApp } from 'firebase/app';
import { makeAutoObservable } from 'mobx';
import { APPS } from 'shared-my';
import {
    type IDocumentStore,
    type IAuthStore,
    type IEquipmentStore,
    type IExplosiveDeviceStore,
    type IEmployeeStore,
    type IMapStore,
    type IMissionReportStore,
    type IMissionRequestStore,
    type IOrderStore,
    type ITransportStore,
    type IUserStore,
    type IOrganizationStore,
    type IViewerStore,
    type IExplosiveObjectStore,
    AuthStore,
    DocumentStore,
    EquipmentStore,
    ExplosiveDeviceStore,
    ExplosiveObjectStore,
    EmployeeStore,
    MapStore,
    MissionReportStore,
    MissionRequestStore,
    OrderStore,
    TransportStore,
    UserStore,
    OrganizationStore,
    ViewerStore,
    type IAuthUser,
    createCurrentUser,
    ExplosiveStore,
    type IExplosiveStore,
    type IBookStore,
    BookStore,
    type ICommonStore,
    CommonStore,
} from 'shared-my-client';

import { Api } from '~/api';
import { FIREBASE_CONFIG } from '~/config';
import { Analytics, Auth, Crashlytics, Logger, Message, SecureStorage, Storage } from '~/services';

export interface IRootStore {
    auth: IAuthStore;
    document: IDocumentStore;
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;
    employee: IEmployeeStore;
    map: IMapStore;
    missionReport: IMissionReportStore;
    missionRequest: IMissionRequestStore;
    order: IOrderStore;
    transport: ITransportStore;
    user: IUserStore;
    organization: IOrganizationStore;
    viewer: IViewerStore;
    book: IBookStore;
    common: ICommonStore;
    isInitialized: boolean;
    isLoaded: boolean;
    removeAllListeners(): void;
    init(): Promise<void>;
}

export class RootStore implements IRootStore {
    auth: IAuthStore;
    document: IDocumentStore;
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
    explosiveDevice: IExplosiveDeviceStore;
    explosiveObject: IExplosiveObjectStore;
    employee: IEmployeeStore;
    map: IMapStore;
    missionReport: IMissionReportStore;
    missionRequest: IMissionRequestStore;
    order: IOrderStore;
    transport: ITransportStore;
    user: IUserStore;
    organization: IOrganizationStore;
    viewer: IViewerStore;
    book: IBookStore;
    common: ICommonStore;

    isLoaded = false;
    isInitialized = false;

    getStores = () => {
        return {
            viewer: this.viewer,
            auth: this.auth,
            document: this.document,
            equipment: this.equipment,
            explosive: this.explosive,
            explosiveDevice: this.explosiveDevice,
            explosiveObject: this.explosiveObject,
            employee: this.employee,
            map: this.map,
            missionReport: this.missionReport,
            missionRequest: this.missionRequest,
            order: this.order,
            transport: this.transport,
            user: this.user,
            organization: this.organization,
            book: this.book,
            common: this.common,
        };
    };

    get services() {
        return {
            auth: Auth,
            secureStorage: SecureStorage,
            storage: Storage,
            analytics: Analytics,
            crashlytics: Crashlytics,
            logger: Logger,
            message: Message,
            localization: Location,
        };
    }

    get api() {
        return Api;
    }

    constructor() {
        this.common = new CommonStore(APPS.DEMINING, this);
        this.viewer = new ViewerStore(this);
        this.auth = new AuthStore(this);
        this.document = new DocumentStore(this);
        this.equipment = new EquipmentStore(this);
        this.explosive = new ExplosiveStore(this);
        this.explosiveDevice = new ExplosiveDeviceStore(this);
        this.explosiveObject = new ExplosiveObjectStore(this);
        this.employee = new EmployeeStore(this);
        this.map = new MapStore(this);
        this.missionRequest = new MissionRequestStore(this);
        this.order = new OrderStore(this);
        this.transport = new TransportStore(this);
        this.user = new UserStore(this);
        this.organization = new OrganizationStore(this);
        this.missionReport = new MissionReportStore(this);
        this.book = new BookStore(this);

        makeAutoObservable(this);
    }

    setInitialized(value: boolean) {
        this.isInitialized = value;
    }

    removeAllListeners() {
        SecureStorage.removeAllListeners();
        Storage.removeAllListeners();
    }

    private async onChangeUser(user: IAuthUser | null) {
        try {
            if (user) {
                this.services.analytics.setUserId(user.uid);
                this.viewer.setAuthData(user);
            }

            if (user && !user.isAnonymous) {
                const res = await this.api.currentUser.get(user.uid);
                if (res) this.viewer.setUser(createCurrentUser(res));
            }

            if (!user) {
                this.services.analytics.setUserId(null);
                this.viewer.removeUser();
            }
        } catch (e) {
            this.services.logger.error(e);
            this.services.message.error('Bиникла помилка');
            this.viewer.removeUser();
        }

        this.setInitialized(true);
        this.viewer.setLoading(false);
    }

    async sync() {
        await Promise.all([
            this.common.syncCountries.run(),
            this.common.syncStatuses.run(),
            this.common.syncMaterials.run(),
            this.employee.subscribeRanks.run(),
            this.explosiveObject.sync.run(),
            this.explosiveObject.syncDetails.run(),
            this.explosiveObject.syncDeeps.run(),
            this.explosiveDevice.sync.run(),
            this.explosiveDevice.syncType.run(),
            this.explosive.sync.run(),
            this.book.sync.run(),
            this.book.syncBookType.run(),
            this.missionRequest.subscribeType.run(),
        ]);
    }

    async init() {
        initializeApp(FIREBASE_CONFIG);

        try {
            await Api.init();

            this.services.analytics.init();
            this.services.crashlytics.init();
            this.api.setLang('uk');
            this.services.auth.onAuthStateChanged(user => this.onChangeUser(user));
        } catch (e) {
            this.services.crashlytics.error('Init', e);
        }

        try {
            await this.sync();
        } catch (e) {
            this.services.crashlytics.error('Sync', e);
            this.api.drop();
            await this.sync();
        }
    }
}
