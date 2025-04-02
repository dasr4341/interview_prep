import React from 'react';
import { setLastViewUrl } from 'lib/redirect-auth';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

const SourceSystemGuard = () => {
    const user =  useSelector((state: RootState) => state.auth.user?.currentUser);
    if (!user) {
        setLastViewUrl();
      }

    if (user && user.customer.onboarded === false) {
        return user.customer.onboarded === false ? <Outlet /> : <Navigate to={routes.events.match} />;
    }

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user?.id ? <Navigate to={routes.events.match} /> : <Navigate to="/login" />;


};

export default SourceSystemGuard;