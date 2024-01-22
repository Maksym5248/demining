import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { DB } from '~/db';
import { Api } from '~/api';

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
		employee: types.optional(EmployeeStore, {}),
		order: types.optional(OrderStore, {}),
		missionRequest: types.optional(MissionRequestStore, {}),
		missionReport: types.optional(MissionReportStore, {}),
		explosiveObject: types.optional(ExplosiveObjectStore, {}),
		transport: types.optional(TransportStore, {}),
		equipment: types.optional(EquipmentStore, {}),
		viewer: types.optional(ViewerStore, {}),
		isInitialized: false,
	})
	.actions((self) => {
		const { SecureStorage, Storage } = getEnv(self);
    
		return {
			removeAllListeners() {
				SecureStorage.removeAllListeners();
				Storage.removeAllListeners();
			},
			createMocks(){
				mockEmployees.forEach(el => {
					self.employee.add.run(el);
				});

				mockMissionRequest.forEach(el => {
					self.missionRequest.add.run(el);
				});

				mockTransport.forEach(el => {
					self.transport.add.run(el);
				});

				mockEquipment.forEach(el => {
					self.equipment.add.run(el);
				});
			},
		};
	}).actions((self) => ({
		init: flow(function* init() {
			self.employee.init();
			yield DB.init();
			yield Api.init();

			try {
				yield self.viewer.fetchUser.run();
			} finally {
				self.isInitialized = true;
			}
		}),
	}));
