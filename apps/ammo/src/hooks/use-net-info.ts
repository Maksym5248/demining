import { useContext } from 'react';

import { NetInfoContext } from '~/context';

export const useNetInfo = () => useContext(NetInfoContext);
