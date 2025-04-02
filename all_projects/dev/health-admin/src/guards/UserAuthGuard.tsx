import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState, useAppSelector } from 'lib/store/app-store';

const UserAuthGuard = () => {
    const user =  useAppSelector((state: RootState) => state.auth.user);
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user?.pretaaHealthCurrentUser.id ? <Outlet /> : <Navigate to="/login" />;
};

export default UserAuthGuard;