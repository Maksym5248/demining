import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import { createStore } from '~/stores';
import { RootRouter } from '~/routes';

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
        <RootRouter />
    </ConfigProvider>
  )
}


const root = createRoot(document.getElementById("root"));
root.render(<App/>)