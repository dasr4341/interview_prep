import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import { routes } from 'routes';
import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';

export const CompanyManagementViewGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user && findCurrentPermission(UserPermissionNames.COMPANIES_MANAGEMENT, user?.pretaaGetCurrentUserPermission)
    ?.capabilities.VIEW ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};

export const CompanyManagementEditGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user && findCurrentPermission(UserPermissionNames.COMPANIES_MANAGEMENT, user?.pretaaGetCurrentUserPermission)
    ?.capabilities.EDIT ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};
