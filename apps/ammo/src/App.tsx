import React, { useEffect } from 'react';

import { RootNavigation } from '~/navigation';

import { Navigation } from './services';
import { Theme } from './styles';
import { ThemeProvider } from './styles/theme';

export function App(): React.JSX.Element {
    useEffect(() => {
        return () => {
            Theme.removeAllListeners();
        };
    }, []);

    return (
        <ThemeProvider theme={Theme}>
            <RootNavigation ref={Navigation.init} />
        </ThemeProvider>
    );
}
