import { createContext } from 'react';

import { NetInfoStateType } from '@react-native-community/netinfo';

import { type INetInfoState } from '~/types';

export const NetInfoContext = createContext<INetInfoState>({
    type: NetInfoStateType.unknown,
    isConnected: null,
    isInternetReachable: null,
    details: null,
});
