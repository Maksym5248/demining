import { useContext } from 'react';

import { Instance } from 'mobx-state-tree';

import { RootStore } from '~/stores';
import { RootStoreContext } from '~/context';

export const useStore = () => useContext<Instance<typeof RootStore>>(RootStoreContext);
