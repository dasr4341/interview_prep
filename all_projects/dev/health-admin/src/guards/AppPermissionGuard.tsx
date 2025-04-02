import { LoadingIndicator } from 'components/LoadingIndicator';
import { UserPermissionNames } from 'health-generatedTypes';
import { sentryCaptureMessage } from 'lib/catch-error';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { useAppSelector } from 'lib/store/app-store';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

export default function AppPermissionGuard({
  privileges,
  capabilitiesType = CapabilitiesType.VIEW,
}: {
  privileges: UserPermissionNames;
  capabilitiesType?: CapabilitiesType;
}) {
  const loading = useAppSelector((state) => state.app.loading);
  const canView = useGetPrivilege(privileges, capabilitiesType);
  const user = useAppSelector((state) => state.auth.user);
  const impersonateInProgress = useAppSelector((state) => state.auth.impersonateInProgress);


  if (loading || impersonateInProgress) {
    return <LoadingIndicator />;
  } else if (canView) {
    return <Outlet />;
  } else if (user && !canView) {
    console.log('Unauthorized routes accessed', { href: location.href, privileges, capabilitiesType, });
    
    sentryCaptureMessage(`Unauthorized routes accessed:  ${location.pathname}`);
    return <Navigate to={routes.unauthorized.match} />;
  } else {  
    return <Navigate to={routes.login.match} />;
  }
}
