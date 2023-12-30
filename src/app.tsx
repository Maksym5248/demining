import { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import { createStore } from '~/stores';
import { RootRouter, modals } from '~/routes';
import { ThemeProvider, ModalProvider } from '~/containers';
import { RootStoreContext } from '~/context';

import "./index.css";

const { store } = createStore();

function App() {
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

const reactRootElement = createRoot(document.getElementById("root"));
reactRootElement.render(<App/>)