import { useEffect } from 'react';

import { ConfigProvider } from 'antd';

import { RootStoreContext } from '~/context';
import { createStore } from '~/stores';
import { RootRouter, modals } from '~/routes';
import { ThemeProvider, ModalProvider } from '~/containers';
import { LogLevel, Logger } from '~/services';

import { CONFIG } from './config';

import "./index.css";

Logger.setLevel(CONFIG.IS_DEBUG ? LogLevel.Debug : LogLevel.None);

const { store } = createStore();


export function App() {
	useEffect(() => {
		store.init();

		return () => {
			store.removeAllListeners();
		}
	}, []);

	return (
		<ConfigProvider>
			<ThemeProvider>
				<RootStoreContext.Provider value={store}>
					<RootRouter />
					<ModalProvider modals={modals}/>
				</RootStoreContext.Provider>
			</ThemeProvider>
		</ConfigProvider>
	)
}

