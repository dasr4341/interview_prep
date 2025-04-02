import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

export const GroupViewGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user &&
    findCurrentPermission(UserPermissionNames.GROUPS, user?.pretaaGetCurrentUserPermission)?.capabilities.VIEW ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};

export const GroupActionGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }
  const permission = findCurrentPermission(UserPermissionNames.GROUPS, user?.pretaaGetCurrentUserPermission);

  return user && (permission?.capabilities.CREATE || permission?.capabilities.EDIT) ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};
