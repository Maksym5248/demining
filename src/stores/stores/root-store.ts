import { types, flow, getEnv, Instance } from 'mobx-state-tree';
import { initializeApp } from 'firebase/app';

import { DB } from '~/db';
import { Api } from '~/api';
import { Analytics, Crashlytics } from '~/services';
import { FIREBASE_CONFIG } from '~/config';

import { AuthStore } from './auth';
import { ViewerStore } from './viewer';
import { EmployeeStore } from './employee';
import { OrderStore } from './order';
import { MissionRequestStore } from './mission-request';
import { ExplosiveObjectStore } from './explosive-object';
import { TransportStore } from './transport';
import { EquipmentStore } from './equipment';
import { mockEmployees, mockMissionRequest, mockEquipment, mockTransport } from './mock-data';
import { MissionReportStore } from './mission-report';

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
		isLoaded: false,
	})
	.views(self => ({
		get isInitialized(){
			return !!self.isLoaded && self.viewer.isLoadUserInfo
		},
	}))
	.actions((self) => {
		const { SecureStorage, Storage } = getEnv(self);
    
		return {
			removeAllListeners() {
				SecureStorage.removeAllListeners();
				Storage.removeAllListeners();
			},
			createMocks(){
				mockEmployees.forEach(el => {
					self.employee.create.run(el);
				});

				mockMissionRequest.forEach(el => {
					self.missionRequest.create.run(el);
				});

				mockTransport.forEach(el => {
					self.transport.create.run(el);
				});

				mockEquipment.forEach(el => {
					self.equipment.create.run(el);
				});
			},
		};
	}).actions((self) => ({
		init: flow(function* init() {
			initializeApp(FIREBASE_CONFIG);

			Analytics.init();
			Crashlytics.init();
			self.employee.init();
			yield DB.init();
			yield Api.init();

			try {
				yield self.viewer.initUser.run();
			} catch(e){
				console.log("e", e)
			}

			self.isLoaded = true;
		}),
	}));
