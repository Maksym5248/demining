import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { ViewerStore } from './viewer';

export type IRootStore = Instance<typeof RootStore>

export const RootStore = types
  .model('RootStore', {
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
        try {
          yield self.viewer.fetchUser.run();
        } finally {
          self.isInitialized = true;
        }
      }),
    };
  });
