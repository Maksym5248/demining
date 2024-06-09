import { initializeApp } from 'firebase/app';

import { FIREBASE_CONFIG } from '~/config';
import { Analytics, AuthService, Crashlytics, SecureStorage, Storage } from '~/services';

import { AuthStore, type IAuthStore } from './auth';
import { DocumentStore, type IDocumentStore } from './document';
import { EmployeeStore, type IEmployeeStore } from './employee';
import { IViewerStore, ViewerStore } from './viewer';

export interface IRootStore {
    auth: IAuthStore;
    document: IDocumentStore;
    employee: IEmployeeStore;
    viewer: IViewerStore;
}

export class RootStore implements IRootStore {
    auth: IAuthStore;
    document: IDocumentStore;
    employee: IEmployeeStore;
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
        this.employee = new EmployeeStore();
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
