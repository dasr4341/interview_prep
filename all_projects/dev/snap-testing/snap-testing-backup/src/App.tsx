import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './Components/ScrollToTop';
import TrackRedirectLinks from './Components/TrackRedirectLinks';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'Lib/MaterialTheme/BaseTheme';

import AppRoutes from './Lib/Routes/AppRoutes';
import HeaderComponent from 'Components/Header/HeaderComponent';

function App() {
  return (
    <div className='App'>
      <ToastContainer />
      <HeaderComponent />
      <ScrollToTop />
      <TrackRedirectLinks />
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </div>
  );
}

export default App;
