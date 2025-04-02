import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './Components/ScrollToTop';
import TrackRedirectLinks from './Components/TrackRedirectLinks';

import { MantineProvider } from '@mantine/core';
import AppRoutes from './Lib/Routes/AppRoutes';

function App() {

  return (
    <div className='App'>
      <MantineProvider withGlobalStyles withNormalizeCSS>
      <ScrollToTop />
      <TrackRedirectLinks />
      <ToastContainer />
      <AppRoutes />
      </MantineProvider>
    </div>
  );
}

export default App;
