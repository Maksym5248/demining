import React, { useCallback, useEffect, useState } from 'react';

import { type NavigationContainerRef } from '@react-navigation/core';
import { observer } from 'mobx-react-lite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { LogLevel, useAsyncEffect } from 'shared-my-client';

import { useStatusBar, useViewModel } from '~/hooks';
import { Localization, LocalizationProvider } from '~/localization';
import { modals, RootNavigation } from '~/navigation';
import { AppState, Crashlytics, Logger, Navigation, NetInfo } from '~/services';
import { ThemeManager, ThemeProvider } from '~/styles';

import { appViewModel, type IAppViewModel } from './AppViewModel';
import { CONFIG } from './config';
import { MessageProvider, ModalProvider, Splash, TooltipProvider } from './containers';
import { Device } from './utils';

enableScreens(true);

Crashlytics.init();

export const App = observer(() => {
    const vm = useViewModel<IAppViewModel>(appViewModel);
    const [visible, setVisible] = useState(true);

    useStatusBar(
        {
            barStyle: 'light-content',
        },
        false,
    );

    useEffect(
        () => () => {
            AppState.removeAllListeners();
            NetInfo.removeAllListeners();
            ThemeManager.removeAllListeners();
            Localization.removeAllListeners();
        },
        [],
    );

    useAsyncEffect(async () => {
        CONFIG.IS_DEBUG && Logger.enable();
        Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);
        Logger.log('VERSION:', Device.appInfo);

        try {
            AppState.init();
            await Promise.allSettled([NetInfo.init(), Localization.init()]);

            AppState.onChange(state => {
                if (state === 'active') {
                    NetInfo.pingInfo();
                }
            });

            await vm.fetch.run();
        } catch (error) {
            Logger.error(error);
        }
    }, []);

    const onAnimationEnd = useCallback(() => {
        setVisible(false);
    }, []);

    const setNavigationRef = useCallback((ref: NavigationContainerRef<any>) => {
        Navigation.init(ref);
    }, []);

    return (
        <GestureHandlerRootView>
            <LocalizationProvider>
                <ThemeProvider>
                    <TooltipProvider>
                        <RootNavigation ref={setNavigationRef} />
                        <MessageProvider />
                        <ModalProvider modals={modals} />
                        {visible && <Splash onAnimationEnd={onAnimationEnd} isReady={vm.fetch.isLoaded} />}
                    </TooltipProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </GestureHandlerRootView>
    );
});
