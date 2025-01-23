import React, { useCallback, useEffect } from 'react';

import { type NavigationContainerRef } from '@react-navigation/core';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import { useViewModel } from '~/hooks';
import { Localization, LocalizationProvider } from '~/localization';
import { RootNavigation } from '~/navigation';
import { Logger, Navigation } from '~/services';
import { ThemeManager, ThemeProvider } from '~/styles';

import { appViewModel, type IAppViewModel } from './AppViewModel';
import { MessageProvider } from './containers';
import { CONFIG } from './config';
import { LogLevel } from 'shared-my-client';

enableScreens(true);

export function App(): React.JSX.Element {
    const vm = useViewModel<IAppViewModel>(appViewModel);

    useEffect(() => {
        CONFIG.IS_DEBUG && Logger.enable();
        Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);
        Localization.init();

        vm.fetch();

        return () => {
            ThemeManager.removeAllListeners();
            Localization.removeAllListeners();
        };
    }, []);

    const setNavigationRef = useCallback((ref: NavigationContainerRef<any>) => {
        Navigation.init(ref);
    }, []);

    return (
        <GestureHandlerRootView>
            <LocalizationProvider>
                <ThemeProvider>
                    <RootNavigation ref={setNavigationRef} />
                    <MessageProvider />
                </ThemeProvider>
            </LocalizationProvider>
        </GestureHandlerRootView>
    );
}
