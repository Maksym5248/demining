import React, { useCallback, useEffect } from 'react';

import { type NavigationContainerRef } from '@react-navigation/core';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { LogLevel, useAsyncEffect } from 'shared-my-client';

import { useStatusBar, useViewModel } from '~/hooks';
import { Localization, LocalizationProvider } from '~/localization';
import { modals, RootNavigation } from '~/navigation';
import { AppState, Crashlytics, Logger, Modal, Navigation, NetInfo } from '~/services';
import { ThemeManager, ThemeProvider } from '~/styles';

import { appViewModel, type IAppViewModel } from './AppViewModel';
import { CONFIG } from './config';
import { MODALS } from './constants';
import { MessageProvider, ModalProvider } from './containers';
import { Device } from './utils';

enableScreens(true);

Crashlytics.init();

export function App(): React.JSX.Element {
    const vm = useViewModel<IAppViewModel>(appViewModel);

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

        Modal.show(MODALS.LOADING);
        try {
            AppState.init();
            await Promise.allSettled([NetInfo.init(), Localization.init()]);

            AppState.onChange(state => {
                if (state === 'active') {
                    NetInfo.pingInfo();
                }
            });

            await vm.fetch();
        } catch (error) {
            Logger.error(error);
        } finally {
            Modal.hide(MODALS.LOADING);
            BootSplash.hide();
        }
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
                    <ModalProvider modals={modals} />
                </ThemeProvider>
            </LocalizationProvider>
        </GestureHandlerRootView>
    );
}
