import { useEffect } from 'react';

import { ConfigProvider } from 'antd';
import uk from 'antd/lib/locale/uk_UA';

import { ThemeProvider, ModalProvider } from '~/containers';
import { RootStoreContext } from '~/context';
import { RootRouter, modals } from '~/routes';
import { LogLevel, Logger } from '~/services';
import { createStore } from '~/stores';

import './index.css';

import { CONFIG } from './config';

Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);

const { store } = createStore();

export function App() {
    useEffect(() => {
        store.init();

        return () => {
            store.removeAllListeners();
        };
    }, []);

    return (
        <ConfigProvider locale={uk}>
            <ThemeProvider>
                <RootStoreContext.Provider value={store}>
                    <RootRouter />
                    <ModalProvider modals={modals} />
                </RootStoreContext.Provider>
            </ThemeProvider>
        </ConfigProvider>
    );
}
