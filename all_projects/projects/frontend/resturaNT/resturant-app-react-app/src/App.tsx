/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './App.css';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './Lib/Routes/AppRoutes';
import TrackRedirectLinks from './Components/TrackRedirectLinks';
import { appEventBus, appEvents } from './Lib/EventBus/global-event-bus';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from './Lib/Routes/Routes';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const regex = location.pathname.match(/\/([-\w]+)$/g);
  const title = regex !== null ? regex[0].slice(1) : '';
  document.title = `Gangotri - ${title}`;

  useEffect(() => {
    appEventBus.on(appEvents.invalidAuthToken, () => {
      navigate(routes.login.path);
    });
  }, []);

  return (
    <div className='App'>
      <TrackRedirectLinks />
      <ToastContainer
        theme={'light'}
        position='top-right'
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        transition={Flip}
        closeButton={false}
      />
      <AppRoutes />
    </div>
  );
}

export default App;
