import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import { useViewModel } from '~/hooks';
import { RootNavigation } from '~/navigation';
import { Navigation } from '~/services';
import { ThemeProvider } from '~/styles';

import { s } from './App.style';
import { appViewModel, type IAppViewModel } from './AppViewModel';

enableScreens(true);

export function App(): React.JSX.Element {
    useViewModel<IAppViewModel>(appViewModel);

    return (
        <GestureHandlerRootView style={s.container}>
            <ThemeProvider>
                <RootNavigation ref={Navigation.init} />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
