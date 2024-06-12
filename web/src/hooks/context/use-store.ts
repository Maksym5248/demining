import { useContext } from 'react';

import { RootStoreContext } from '~/context';
import { type IRootStore } from '~/stores';

export const useStore = () => useContext<IRootStore>(RootStoreContext);
