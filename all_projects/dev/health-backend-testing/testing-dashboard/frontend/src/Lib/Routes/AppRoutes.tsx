import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthGuard } from '../Guards/AuthGuard';
import routes from './Routes';

const NotFound = React.lazy(() => import('Page/NotFoundPage'));
const IndexPage = React.lazy(() => import('Page/Index'));

import { AuthRoutes } from 'Page/Auth/AuthRoutes';
import { PostRoutes } from 'Page/Dashboard/Post/PostRoutes';
import { UiRoutes } from 'Page/Dashboard/Ui/UiRoutes';
import { TestUIRoutes } from 'Page/Dashboard/Test/TestRoutes';
import { getDbCurrentInstance, setDbInstance } from 'helper/dbInstance';
import { config } from 'config';

const DashboardPage = React.lazy(() => import('Page/Dashboard/DashboardPage'));
const ProfilePage = React.lazy(() => import('Page/Profile/ProfilePage'));

export default function AppRoutes() {

  useEffect(() => {
    if (!getDbCurrentInstance()) {
      setDbInstance(config.environment.defaultEnv);
    }
  }, []);


  return (
    <div>
      <Suspense fallback={<></>}>
        <Routes>
          <Route path={routes.home.path} element={<IndexPage />} />

          <Route path={routes.dashboard.path} element={<DashboardPage />}>
            <Route path={routes.dashboard.me.path} element={<AuthGuard />}>
              <Route path={routes.dashboard.me.path} element={(<ProfilePage />)} />
            </Route>
            
            {PostRoutes}
            {UiRoutes}
            {TestUIRoutes}
          </Route>
          

          {AuthRoutes}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
