import React, { useEffect } from 'react';

import { ConfigProvider } from 'antd';
import * as ReactDOM from 'react-dom';

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


ReactDOM.render(<App/>, document.body);
