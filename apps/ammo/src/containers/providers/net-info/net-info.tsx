import React, { useState, memo, useEffect } from 'react';

import { NetInfoContext } from '~/context';
import { NetInfo } from '~/services';
import { type INetInfoState } from '~/types';

import { type INetInfoProviderProps } from './net-info.types';

export const NetInfoProvider = memo(({ children }: INetInfoProviderProps) => {
    const [value, setValue] = useState<INetInfoState>(NetInfo.getInfo());

    useEffect(() => {
        const removeListener = NetInfo.onChange(v => {
            setValue(v);
        });

        return () => {
            removeListener();
        };
    }, []);

    return <NetInfoContext.Provider value={value}>{children}</NetInfoContext.Provider>;
});

NetInfoProvider.displayName = 'NetInfoProvider';
