import { initializeApp } from 'firebase/app';
import { makeAutoObservable } from 'mobx';
import {
    type IDocumentStore,
    type IAuthStore,
    type IEquipmentStore,
    type IExplosiveStore,
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
    ExplosiveStore,
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
} from 'shared-my-client/stores';

import { Api } from '~/api';
import { FIREBASE_CONFIG } from '~/config';
import { DB } from '~/db';
import { Analytics, Auth, Crashlytics, Logger, Message, SecureStorage, Storage } from '~/services';

export interface IRootStore {
    auth: IAuthStore;
    document: IDocumentStore;
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
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

    get stores() {
        return {
            auth: this.auth,
            document: this.document,
            equipment: this.equipment,
            explosive: this.explosive,
            explosiveObject: this.explosiveObject,
            employee: this.employee,
            map: this.map,
            missionReport: this.missionReport,
            missionRequest: this.missionRequest,
            order: this.order,
            transport: this.transport,
            user: this.user,
            organization: this.organization,
            viewer: this.viewer,
        };
    }

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
        this.auth = new AuthStore(this);
        this.document = new DocumentStore(this);
        this.equipment = new EquipmentStore(this);
        this.explosive = new ExplosiveStore(this);
        this.explosiveObject = new ExplosiveObjectStore(this);
        this.employee = new EmployeeStore(this);
        this.map = new MapStore(this);
        this.missionRequest = new MissionRequestStore(this);
        this.order = new OrderStore(this);
        this.transport = new TransportStore(this);
        this.user = new UserStore(this);
        this.organization = new OrganizationStore(this);
        this.viewer = new ViewerStore(this);
        this.missionReport = new MissionReportStore(this);

        makeAutoObservable(this);
    }

    setLoaded(value: boolean) {
        this.isLoaded = value;
    }
    get isInitialized() {
        return !!this.isLoaded && this.viewer.isInitialized;
    }

    removeAllListeners() {
        SecureStorage.removeAllListeners();
        Storage.removeAllListeners();
    }

    async init() {
        initializeApp(FIREBASE_CONFIG);

        this.services.analytics.init();
        this.services.crashlytics.init();

        try {
            await DB.init();

            await Promise.all([this.employee.fetchRanks.run(), this.explosiveObject.fetchDeeps.run()]);

            this.viewer.initUser();
        } catch (e) {
            this.services.logger.error('init', e);
        }

        this.setLoaded(true);
    }
}
