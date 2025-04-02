import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../Store/hooks';
import routes from '../Routes/Routes';

export default function UnAuthGuard() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  
  if (currentUser) {
    return <Navigate to={routes.dashboard.children.me.fullPath}/>;
  } else {
    return <Outlet />;
  }
}
