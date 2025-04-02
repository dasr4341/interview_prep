import { RootState } from 'lib/store/app-store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from 'routes';

const UnAuthGuard = () => {
    const user =  useSelector((state: RootState) => state.auth.user?.currentUser);
    
   if (user) {
    return <Navigate to={routes.events.match} />;
   } else {
    return  <Outlet />;
   }
    
};

export default UnAuthGuard;