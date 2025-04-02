import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './Routes';
import HomePage from '../../pages/HomePage/HomePage';

function AppRoutes() {
  return (
    <>
      <Suspense>
        <Routes>
          <Route path={routes.home.path} element={<HomePage />} />
          <Route path={routes.aboutUs.path} element={<HomePage />} />
          <Route path={routes.contactUs.path} element={<HomePage />} />
          <Route path={routes.blogs.path} element={<HomePage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default AppRoutes;