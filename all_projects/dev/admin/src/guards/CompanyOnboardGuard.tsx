import { setLastViewUrl } from 'lib/redirect-auth';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

export const CompanyOnboardGuard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    setLastViewUrl();
  }

  return user && user.currentUser.customer.onboarded ? <Outlet /> : <Navigate to={routes.sourceSystem.match} />;
};
