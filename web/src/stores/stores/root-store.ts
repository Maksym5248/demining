import { initializeApp } from 'firebase/app';
import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { FIREBASE_CONFIG } from '~/config';
import { DB } from '~/db';
import { Analytics, Crashlytics, Logger } from '~/services';

import { AuthStore } from './auth';
import { DocumentStore } from './document';
import { EmployeeStore } from './employee';
import { EquipmentStore } from './equipment';
import { ExplosiveStore } from './explosive';
import { ExplosiveObjectStore } from './explosive-object';
import { MapStore } from './map';
import { MissionReportStore } from './mission-report';
import { MissionRequestStore } from './mission-request';
import { OrderStore } from './order';
import { OrganizationStore } from './organization';
import { TransportStore } from './transport';
import { UserStore } from './user';
import { ViewerStore } from './viewer';

export type IRootStore = Instance<typeof RootStore>;

export const RootStore = types
    .model('RootStore', {
        auth: types.optional(AuthStore, {}),
        employee: types.optional(EmployeeStore, {}),
        order: types.optional(OrderStore, {}),
        missionRequest: types.optional(MissionRequestStore, {}),
        missionReport: types.optional(MissionReportStore, {}),
        explosive: types.optional(ExplosiveStore, {}),
        explosiveObject: types.optional(ExplosiveObjectStore, {}),
        transport: types.optional(TransportStore, {}),
        equipment: types.optional(EquipmentStore, {}),
        viewer: types.optional(ViewerStore, {}),
        organization: types.optional(OrganizationStore, {}),
        user: types.optional(UserStore, {}),
        document: types.optional(DocumentStore, {}),
        map: types.optional(MapStore, {}),
        isLoaded: false,
    })
    .views((self) => ({
        get isInitialized() {
            return !!self.isLoaded && self.viewer.isInitialized;
        },
    }))
    .actions((self) => {
        const { SecureStorage, Storage } = getEnv(self);

        return {
            removeAllListeners() {
                SecureStorage.removeAllListeners();
                Storage.removeAllListeners();
            },
        };
    })
    .actions((self) => ({
        init: flow(function* init() {
            initializeApp(FIREBASE_CONFIG);

            Analytics.init();
            Crashlytics.init();
            self.employee.init();
            self.explosiveObject.init();

            yield DB.init();

            try {
                yield self.viewer.initUser.run();
            } catch (e) {
                Logger.error('init', e);
            }

            self.isLoaded = true;
        }),
    }));
