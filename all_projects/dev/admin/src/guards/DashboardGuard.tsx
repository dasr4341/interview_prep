import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

export const MyInsightsGuard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) {
        setLastViewUrl();
    }

    return user && findCurrentPermission(UserPermissionNames.MY_INSIGHTS, user?.pretaaGetCurrentUserPermission)
        ?.capabilities.VIEW ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};

export const TeamInsightsGuard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) {
        setLastViewUrl();
    }

    return user && findCurrentPermission(UserPermissionNames.TEAM_INSIGHTS, user?.pretaaGetCurrentUserPermission)
        ?.capabilities.VIEW ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};
