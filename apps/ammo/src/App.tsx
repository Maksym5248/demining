import React, { useCallback, useEffect } from 'react';

import { type NavigationContainerRef } from '@react-navigation/core';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import { useViewModel } from '~/hooks';
import { RootNavigation } from '~/navigation';
import { Navigation } from '~/services';
import { ThemeProvider } from '~/styles';

import { appViewModel, type IAppViewModel } from './AppViewModel';
import { MessageProvider } from './containers';

enableScreens(true);

export function App(): React.JSX.Element {
    const vm = useViewModel<IAppViewModel>(appViewModel);

    useEffect(() => {
        vm.fetch();
    }, []);

    const setNavigationRef = useCallback((ref: NavigationContainerRef<any>) => {
        Navigation.init(ref);
    }, []);

    return (
        <GestureHandlerRootView>
            <ThemeProvider>
                <RootNavigation ref={setNavigationRef} />
                <MessageProvider />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
