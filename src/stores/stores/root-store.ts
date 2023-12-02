import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { DB } from '~/db';
import { Api } from '~/api';

import { ViewerStore } from './viewer';
import { EmployeeStore } from './employee';
import { OrderStore } from './order';
import { MissionRequestStore } from './mission-request';
import { mockEmployees, mockMissionRequest } from './mock-data';

export type IRootStore = Instance<typeof RootStore>

export const RootStore = types
  .model('RootStore', {
    employee: types.optional(EmployeeStore, {}),
    order: types.optional(OrderStore, {}),
    missionRequest: types.optional(MissionRequestStore, {}),
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
      },
    };
  }).actions((self) => {    
    return {
      init: flow(function* init() {
        self.employee.init();
        yield DB.init();
        yield Api.explosiveObjectType.init();

        try {
          yield self.viewer.fetchUser.run();
        } finally {
          self.isInitialized = true;
        }
      }),
    };
  });
