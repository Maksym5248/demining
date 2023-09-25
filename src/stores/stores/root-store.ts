import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { ViewerStore } from './viewer';
import { EmployeeStore } from './employee';

export type IRootStore = Instance<typeof RootStore>

export const RootStore = types
  .model('RootStore', {
    employee: types.optional(EmployeeStore, {}),
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
      init: flow(function* init() {
        self.employee.init();

        try {
          yield self.viewer.fetchUser.run();
        } finally {
          self.isInitialized = true;
        }
      }),
    };
  });
