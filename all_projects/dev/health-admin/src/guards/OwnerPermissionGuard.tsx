import { useAppSelector } from 'lib/store/app-store';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { routes } from 'routes';

export default function OwnerPermissionGuard() {
  const userData = useAppSelector(state => state.auth);
  const impersonateInProgress = useAppSelector((state) => state.auth.impersonateInProgress);
  const loading = useAppSelector((state) => state.app.loading);

  if (impersonateInProgress || loading) {
    return <LoadingIndicator />;
  } else if (userData?.pretaaAdmin?.id) {
    return <Outlet />;
  } else if (userData.user) {
    console.log('Unauthorized routes accessed', { href: location.href, impersonateInProgress, loading });

    return <Navigate to={routes.unauthorized.match} />;
  } else {
    return <Navigate to={routes.owner.login.match} />;
 }
}
