import { setLastViewUrl } from 'lib/redirect-auth';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

const SuperAdminAuthGuard = () => {
  const admin = useSelector((state: RootState) => state.auth.admin);
  if (!admin) {
    setLastViewUrl();
  }
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to super user login page
  return admin?.pretaaAdminCurrentUser?.id ? <Outlet /> : <Navigate to={routes.superUserLogin.match} />;
};

export default SuperAdminAuthGuard;
