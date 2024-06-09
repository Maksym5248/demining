import { createContext } from 'react';

import { Instance } from 'mobx-state-tree';

import { RootStore } from '~/stores';

export const RootStoreContext: React.Context<Instance<typeof RootStore>> = createContext<Instance<typeof RootStore>>(
    null as unknown as Instance<typeof RootStore>,
);
