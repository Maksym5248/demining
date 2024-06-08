import { useContext } from 'react';

import { Instance } from 'mobx-state-tree';

import { RootStoreContext } from '~/context';
import { RootStore } from '~/stores';

export const useStore = () => useContext<Instance<typeof RootStore>>(RootStoreContext);
