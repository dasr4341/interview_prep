import { UserPermissionNames } from 'generatedTypes';
import { setLastViewUrl } from 'lib/redirect-auth';
import { findCurrentPermission } from 'lib/roles-and-permissions';
import { RootState } from 'lib/store/app-store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

const RoleManagementGuard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) {
        setLastViewUrl();
    }

    return user && findCurrentPermission(UserPermissionNames.ROLE_MANAGEMENT, user?.pretaaGetCurrentUserPermission)
    ?.capabilities.VIEW ? <Outlet /> : <Navigate to={routes.unauthorized.match} />;
};

export default RoleManagementGuard;