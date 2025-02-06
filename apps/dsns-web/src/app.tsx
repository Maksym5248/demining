import { useEffect } from 'react';

import { ConfigProvider } from 'antd';
import uk from 'antd/lib/locale/uk_UA';
import { Timestamp } from 'firebase/firestore';
import { dates, LogLevel } from 'shared-my-client';

import { ThemeProvider, ModalProvider } from '~/containers';
import { RootStoreContext } from '~/context';
import { RootRouter, modals } from '~/routes';
import { Logger } from '~/services';
import { RootStore } from '~/stores';

import { CONFIG } from './config';

import './index.css';

!!CONFIG.IS_DEBUG && Logger.enable();
Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);
dates.init(Timestamp);
const store = new RootStore();

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
