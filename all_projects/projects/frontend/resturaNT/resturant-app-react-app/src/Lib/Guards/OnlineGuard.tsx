import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../Store/hooks';
import routes from '../Routes/Routes';

export default function OnlineGuard() {
  const onlineState = useAppSelector((state) => state.user.onlineState);

  if (onlineState) {
    return <Outlet />;
  } else {
    return <Navigate to={routes.dashboard.children.me.fullPath} />;
  }
}
