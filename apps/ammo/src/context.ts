import { createContext } from 'react';

import { NetInfoStateType } from '@react-native-community/netinfo';

import { type ITooltipContext, type ITooltipRootContext, type INetInfoState } from '~/types';

export const NetInfoContext = createContext<INetInfoState>({
    type: NetInfoStateType.unknown,
    isConnected: null,
    isInternetReachable: null,
    details: null,
});

export const TooltipContext = createContext<ITooltipContext>({
    show: () => undefined,
    hide: () => undefined,
});

export const TooltipRootContext = createContext<ITooltipRootContext>({
    onScrollBegin: () => undefined,
    hide: () => undefined,
});
