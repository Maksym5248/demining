import { createContext } from 'react';

import { Instance } from 'mobx-state-tree';

import { RootStore } from '~/stores';

export const RootStoreContext = createContext<Instance<typeof RootStore>>(null);