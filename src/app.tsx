import React, { useEffect } from 'react';

import * as ReactDOM from 'react-dom';

import { createStore } from '~/stores';

const { store } = createStore();

const App = () => {
  useEffect(() => {
    store.init();

    return () => {
      store.removeAllListeners();
    }
  }, []);

  return (
    <h2>Hello from React!</h2>
  )
}


ReactDOM.render(<App/>, document.body);
