import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../Store/hooks';
import routes from '../Routes/Routes';

export default function AuthGuard() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  if (currentUser) {
    return <Outlet />;
  } else {
    return <Navigate to={routes.login.path} />;
  }
}
