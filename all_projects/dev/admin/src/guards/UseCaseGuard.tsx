import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

export const UseCaseViewGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user &&
    findCurrentPermission(UserPermissionNames.USE_CASE_COLLECTIONS, user?.pretaaGetCurrentUserPermission)?.capabilities
      .VIEW ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};

export const UseCaseCreateGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user &&
    findCurrentPermission(UserPermissionNames.USE_CASE_COLLECTIONS, user?.pretaaGetCurrentUserPermission)?.capabilities
      .CREATE ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};

