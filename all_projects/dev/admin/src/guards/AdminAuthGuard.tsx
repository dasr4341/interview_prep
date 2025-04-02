import { RootState } from 'lib/store/app-store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminAuthGuard = () => {
    const user =  useSelector((state: RootState) => state.auth.user?.currentUser);

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user?.id ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminAuthGuard;