import React, { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogLevel } from 'shared-my-client/services';

import { RootNavigation } from '~/navigation';

import { s } from './App.style';
import { CONFIG } from './config';
import { Logger, Navigation } from './services';
import { ThemeProvider, ThemeManager } from './styles';

Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);

export function App(): React.JSX.Element {
    useEffect(() => {
        console.log('ENV: ', CONFIG.ENV);
        return () => {
            ThemeManager.removeAllListeners();
        };
    }, []);

    return (
        <GestureHandlerRootView style={s.container}>
            <ThemeProvider>
                <RootNavigation ref={Navigation.init} />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
