/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import AppWrapper from 'app-wrapper';
import { BrowserRouter } from 'react-router-dom';
import store from './lib/store/app-store';
import { Provider } from 'react-redux';
import { sentryInit } from './lib/sentry.init';

function App(): JSX.Element {
  sentryInit();
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
