import React from 'react';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';
import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';

export const ReferenceGuardView = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user &&
    findCurrentPermission(UserPermissionNames.ADD_A_REFERENCE, user?.pretaaGetCurrentUserPermission)?.capabilities
      .VIEW ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};

export const ReferenceGuardCreate = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user &&
    findCurrentPermission(UserPermissionNames.ADD_A_REFERENCE, user?.pretaaGetCurrentUserPermission)?.capabilities
      .CREATE ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};
