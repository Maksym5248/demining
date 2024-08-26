import React, { useEffect } from 'react';

import { RootNavigation } from '~/navigation';

import { Navigation } from './services';
import { ThemeProvider, ThemeManager } from './styles';

export function App(): React.JSX.Element {
    useEffect(() => {
        return () => {
            ThemeManager.removeAllListeners();
        };
    }, []);

    return (
        <ThemeProvider>
            <RootNavigation ref={Navigation.init} />
        </ThemeProvider>
    );
}
