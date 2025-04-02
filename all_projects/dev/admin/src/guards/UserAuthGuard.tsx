import { config } from 'config';
import { setLastViewUrl } from 'lib/redirect-auth';
import { RootState } from 'lib/store/app-store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

const UserAuthGuard = () => {
    const user =  useSelector((state: RootState) => state.auth.user?.currentUser);
    const adminUser = useSelector((state: RootState) => state.auth.admin);
    const token = localStorage.getItem(config.storage.token);

    if (!user && !token || !adminUser && !token ) {
        setLastViewUrl();
    }

    if (adminUser && adminUser.pretaaAdminCurrentUser) {
        return adminUser.pretaaAdminCurrentUser.id ? <Outlet /> : <Navigate to={routes.superUserLogin.match} />;
    }

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user?.id ? <Outlet /> : <Navigate to="/login" />;
};

export default UserAuthGuard;