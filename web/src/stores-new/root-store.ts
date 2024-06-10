import { initializeApp } from 'firebase/app';

import { FIREBASE_CONFIG } from '~/config';
import { Analytics, AuthService, Crashlytics, SecureStorage, Storage } from '~/services';

import { AuthStore, type IAuthStore } from './auth';
import { DocumentStore, type IDocumentStore } from './document';
import { EmployeeStore, type IEmployeeStore } from './employee';
import { EquipmentStore, IEquipmentStore } from './equipment';
import { ExplosiveStore, IExplosiveStore } from './explosive';
import { ExplosiveObjectStore } from './explosive-object';
import { IMapStore, MapStore } from './map';
import { IMissionRequestStore, MissionRequestStore } from './mission-request';
import { IViewerStore, ViewerStore } from './viewer';

export interface IRootStore {
    isLoaded: boolean;
    auth: IAuthStore;
    document: IDocumentStore;
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
    explosiveObject: ExplosiveObjectStore;
    employee: IEmployeeStore;
    map: IMapStore;
    missionRequest: IMissionRequestStore;
    viewer: IViewerStore;
}

export class RootStore implements IRootStore {
    auth: IAuthStore;
    document: IDocumentStore;
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
    explosiveObject: ExplosiveObjectStore;
    employee: IEmployeeStore;
    map: IMapStore;
    missionRequest: IMissionRequestStore;
    viewer: IViewerStore;

    isLoaded = false;

    private get services() {
        return {
            auth: AuthService,
            secureStorage: SecureStorage,
            storage: Storage,
            analytics: Analytics,
            crashlytics: Crashlytics,
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
        this.missionRequest = new MissionRequestStore();
        this.viewer = new ViewerStore();
    }

    get isInitialized() {
        return !!this.isLoaded && this.viewer.isInitialized;
    }

    removeAllListeners() {
        SecureStorage.removeAllListeners();
        Storage.removeAllListeners();
    }

    init() {
        initializeApp(FIREBASE_CONFIG);

        this.services.analytics.init();
        this.services.crashlytics.init();
    }
}
