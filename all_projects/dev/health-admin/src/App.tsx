/*  */
import React, { useEffect } from 'react';
import AppWrapper from 'app-wrapper';
import { BrowserRouter } from 'react-router-dom';
import store from './lib/store/app-store';
import { Provider } from 'react-redux';
import { sentryInit } from './lib/sentry.init';
import { getAppData, setAppData } from 'lib/set-app-data';
import version from './version.json';

function App(): JSX.Element {

  useEffect(() => {
    const data = getAppData();
    data.buildNo = version.build;
    console.log(data);
    setAppData(data);
  }, []);
  
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
