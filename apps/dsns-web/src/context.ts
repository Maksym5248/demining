import { createContext } from 'react';

import { type IRootStore } from '~/stores';

export const RootStoreContext: React.Context<IRootStore> = createContext<IRootStore>(null as unknown as IRootStore);
