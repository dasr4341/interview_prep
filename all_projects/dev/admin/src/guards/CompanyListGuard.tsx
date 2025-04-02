import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import { routes } from 'routes';
import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';

export const CompanyListViewGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user && findCurrentPermission(UserPermissionNames.LISTS, user?.pretaaGetCurrentUserPermission)
    ?.capabilities.VIEW ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};

export const CompanyListEditGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user && findCurrentPermission(UserPermissionNames.LISTS, user?.pretaaGetCurrentUserPermission)
    ?.capabilities.EDIT ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};

export const CompanyListCreateGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user && findCurrentPermission(UserPermissionNames.LISTS, user?.pretaaGetCurrentUserPermission)
    ?.capabilities.CREATE ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};

export const CompanyListDeleteGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user && findCurrentPermission(UserPermissionNames.LISTS, user?.pretaaGetCurrentUserPermission)
    ?.capabilities.DELETE ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};