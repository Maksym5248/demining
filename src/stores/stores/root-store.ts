import { types, flow, getEnv, Instance } from 'mobx-state-tree';
import { initializeApp } from 'firebase/app';

import { DB } from '~/db';
import { Analytics, Crashlytics, Logger } from '~/services';
import { FIREBASE_CONFIG } from '~/config';

import { AuthStore } from './auth';
import { ViewerStore } from './viewer';
import { EmployeeStore } from './employee';
import { OrderStore } from './order';
import { MissionRequestStore } from './mission-request';
import { ExplosiveObjectStore } from './explosive-object';
import { TransportStore } from './transport';
import { EquipmentStore } from './equipment';
import { MissionReportStore } from './mission-report';
import { OrganizationStore } from './organization';
import { UserStore } from './user';

export type IRootStore = Instance<typeof RootStore>

export const RootStore = types
	.model('RootStore', {
		auth: types.optional(AuthStore, {}),
		employee: types.optional(EmployeeStore, {}),
		order: types.optional(OrderStore, {}),
		missionRequest: types.optional(MissionRequestStore, {}),
		missionReport: types.optional(MissionReportStore, {}),
		explosiveObject: types.optional(ExplosiveObjectStore, {}),
		transport: types.optional(TransportStore, {}),
		equipment: types.optional(EquipmentStore, {}),
		viewer: types.optional(ViewerStore, {}),
		organization: types.optional(OrganizationStore, {}),
		user: types.optional(UserStore, {}),
		isLoaded: false,
	})
	.views(self => ({
		get isInitialized(){
			return !!self.isLoaded && !self.viewer.isLoadingUserInfo
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
	}).actions((self) => ({
		init: flow(function* init() {
			initializeApp(FIREBASE_CONFIG);

			Analytics.init();
			Crashlytics.init();
			self.employee.init();
			yield DB.init();

			try {
				yield self.viewer.initUser.run();
			} catch(e){
				Logger.error("init", e)
			}

			self.isLoaded = true;
		}),
	}));
