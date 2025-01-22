import React, { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import { useViewModel } from '~/hooks';
import { RootNavigation } from '~/navigation';
import { Navigation } from '~/services';
import { ThemeProvider } from '~/styles';

import { appViewModel, type IAppViewModel } from './AppViewModel';
// import { MessageProvider } from './containers';

enableScreens(true);

export function App(): React.JSX.Element {
    const vm = useViewModel<IAppViewModel>(appViewModel);

    useEffect(() => {
        vm.fetch();
    }, []);

    return (
        <GestureHandlerRootView>
            <ThemeProvider>
                <RootNavigation ref={Navigation.init} />
                {/* <MessageProvider /> */}
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
