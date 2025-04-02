import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import routes from '../Routes/Routes';
import { useAppSelector } from '../Store/hooks';

export  function AuthGuard() {
  const user = useAppSelector(state => state.user.currentUser);

  if (user) {
    return <Outlet />;
  } else {
    return <Navigate to={routes.login.path} />;
  }
}