import { initializeApp } from 'firebase/app';

import { FIREBASE_CONFIG } from '~/config';
import { DB } from '~/db';
import { Analytics, AuthService, Crashlytics, Logger, SecureStorage, Storage } from '~/services';

import { AuthStore, type IAuthStore } from './auth';
import { DocumentStore, type IDocumentStore } from './document';
import { EmployeeStore, type IEmployeeStore } from './employee';
import { EquipmentStore, type IEquipmentStore } from './equipment';
import { ExplosiveStore, type IExplosiveStore } from './explosive';
import { ExplosiveObjectStore } from './explosive-object';
import { type IMapStore, MapStore } from './map';
import { type IMissionReportStore, MissionReportStore } from './mission-report';
import { type IMissionRequestStore, MissionRequestStore } from './mission-request';
import { type IOrderStore, OrderStore } from './order';
import { type IOrganizationStore, OrganizationStore } from './organization';
import { type ITransportStore, TransportStore } from './transport';
import { type IUserStore, UserStore } from './user';
import { type IViewerStore, ViewerStore } from './viewer';

export interface IRootStore {
    auth: IAuthStore;
    document: IDocumentStore;
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
    explosiveObject: ExplosiveObjectStore;
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
    explosiveObject: ExplosiveObjectStore;
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

    private get services() {
        return {
            auth: AuthService,
            secureStorage: SecureStorage,
            storage: Storage,
            analytics: Analytics,
            crashlytics: Crashlytics,
            logger: Logger,
        };
    }

    constructor() {
        this.auth = new AuthStore({ services: this.services });
        this.document = new DocumentStore();
        this.equipment = new EquipmentStore();
        this.explosive = new ExplosiveStore();
        this.explosiveObject = new ExplosiveObjectStore();
        this.employee = new EmployeeStore();
        this.map = new MapStore();
        this.missionReport = new MissionReportStore({ stores: this });
        this.missionRequest = new MissionRequestStore();
        this.order = new OrderStore({ stores: this });
        this.transport = new TransportStore();
        this.user = new UserStore();
        this.organization = new OrganizationStore({ stores: this });
        this.viewer = new ViewerStore();
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
        this.employee.init();
        this.explosiveObject.init();

        await DB.init();

        try {
            this.viewer.initUser();
        } catch (e) {
            this.services.logger.error('init', e);
        }

        this.setLoaded(true);
    }
}
