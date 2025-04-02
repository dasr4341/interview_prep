import { getRedirectUrl } from 'lib/api/users';
import { useAppSelector } from 'lib/store/app-store';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { routes } from 'routes';

const UnAuthGuard = () => {
  const user = useAppSelector(state => state.auth.user);
  const ownerStore = useAppSelector(state => state.auth.pretaaAdmin);

  const location = useLocation();

  const [defaultRoutes, setDefaultRoutes] = useState('');

  useEffect(() => {
    if (user?.pretaaHealthCurrentUser?.id && !ownerStore) {
      setDefaultRoutes(getRedirectUrl(user));
    } else if (ownerStore) {
      setDefaultRoutes(routes.owner.clientManagement.match);
    }
  }, [user, location.pathname, ownerStore]);

  if (user?.pretaaHealthCurrentUser?.id && !ownerStore) {
    return <Navigate to={defaultRoutes} />;
  } else if (ownerStore) {
    return <Navigate to={defaultRoutes} />;
  } else {
    return <Outlet />;
  }
};

export default UnAuthGuard;
