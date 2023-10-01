import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import { createStore } from '~/stores';
import { RootRouter } from '~/routes';
import { ThemeProvider } from '~/containers';

import "./index.css";

const { store } = createStore();

const App = () => {
  useEffect(() => {
    store.init();

    return () => {
      store.removeAllListeners();
    }
  }, []);

  return (
    <ConfigProvider>
      <ThemeProvider>
        <RootRouter />
      </ThemeProvider>
    </ConfigProvider>
  )
}

const reactRootElement = createRoot(document.getElementById("root"));
reactRootElement.render(<App/>)