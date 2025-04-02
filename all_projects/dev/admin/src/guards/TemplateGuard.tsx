import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

export const TemplateViewGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user &&
    findCurrentPermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES, user?.pretaaGetCurrentUserPermission)
      ?.capabilities.VIEW ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};

export const TemplateCreateGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user &&
    findCurrentPermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES, user?.pretaaGetCurrentUserPermission)
      ?.capabilities.CREATE ? (
    <Outlet />
  ) : (
    <Navigate to={routes.unauthorized.match} />
  );
};
