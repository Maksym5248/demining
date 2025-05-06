import React, { useCallback, useEffect } from 'react';

import { Timestamp } from '@react-native-firebase/firestore';
import { type NavigationContainerRef } from '@react-navigation/core';
import { observer } from 'mobx-react-lite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { dates } from 'shared-my-client';

import { useStatusBar, useViewModel } from '~/hooks';
import { LocalizationProvider } from '~/localization';
import { modals, RootNavigation } from '~/navigation';
import { Crashlytics, Navigation } from '~/services';
import { ThemeProvider } from '~/styles';

import { appViewModel, type IAppViewModel } from './AppViewModel';
import { AlertProvider, Debugger, MessageProvider, ModalProvider, Splash, TooltipProvider, UpdaterProvider } from './containers';

enableScreens(true);

Crashlytics.init();
dates.init(Timestamp);

export const App = observer(() => {
    const vm = useViewModel<IAppViewModel>(appViewModel);

    useStatusBar(
        {
            barStyle: 'light-content',
        },
        false,
    );

    useEffect(() => {
        vm.initialization.run();
    }, []);

    const onAnimationEnd = useCallback(() => {
        vm.animationFinished();
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
                        <ModalProvider modals={modals} />
                        <MessageProvider />
                        <AlertProvider />
                        <UpdaterProvider />
                        <Debugger />
                        {vm.isVisibleSplash && <Splash onAnimationEnd={onAnimationEnd} isReady={vm.initialization.isLoaded} />}
                    </TooltipProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </GestureHandlerRootView>
    );
});
