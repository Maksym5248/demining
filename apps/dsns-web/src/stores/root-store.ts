import { initializeApp } from 'firebase/app';
import { makeAutoObservable } from 'mobx';
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
} from 'shared-my-client';
import { createCurrentUser, ExplosiveStore, type IExplosiveStore } from 'shared-my-client/stores';

import { Api } from '~/api';
import { FIREBASE_CONFIG } from '~/config';
import { DB } from '~/db';
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
        };
    }

    get api() {
        return Api;
    }

    constructor() {
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
                await this.services.auth.refreshToken();
                const res = await this.api.user.get(user.uid);

                if (res) this.viewer.setUser(createCurrentUser(res));
                await this.explosiveObject.fetchDeeps.run();
            } else {
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

    async init() {
        initializeApp(FIREBASE_CONFIG);

        this.services.analytics.init();
        this.services.crashlytics.init();

        try {
            this.viewer.setLoading(true);
            await DB.init();

            this.services.auth.onAuthStateChanged(user => this.onChangeUser(user));

            await this.employee.fetchRanks.run();
        } catch (e) {
            this.services.logger.error('init', e);
        }
    }
}
