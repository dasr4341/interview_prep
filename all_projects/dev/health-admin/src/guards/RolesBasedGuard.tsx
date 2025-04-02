/*  */
import { LoadingIndicator } from 'components/LoadingIndicator';
import { UserTypeRole } from 'health-generatedTypes';
import { sentryCaptureMessage } from 'lib/catch-error';
import { getAppData } from 'lib/set-app-data';
import { useAppSelector } from 'lib/store/app-store';
import useSelectedRole from 'lib/useSelectedRole';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

export default function RolesBasedGuard({
  userTypes,
}: {
  userTypes: UserTypeRole[];
}) {
  const loading = useAppSelector((state) => state.app.loading);
  const canView = useSelectedRole({ roles: userTypes });
  const user = useAppSelector((state) => state.auth.user);
  const appData = getAppData();

  if (loading) {
    return <LoadingIndicator />;
  } else if (canView) {
    return <Outlet />;
  } else if (user && !canView) {
    console.log('Unauthorized routes accessed', { href: location.href, selectedRole: appData.selectedRole,  });
    sentryCaptureMessage(`Unauthorized routes accessed:  ${location.pathname}`);
    return <Navigate to={routes.unauthorized.match} />;
  } else {  
    return <Navigate to={routes.login.match} />;
  }
}
