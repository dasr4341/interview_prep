import { config } from 'config';
import routes from 'Lib/Routes/Routes';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthGuard() {
  if (localStorage.getItem(config.storage.token)) {
    return <Outlet />;
  } else {
    return <Navigate to={routes.login.path} />;
  }
}
