/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import LoadingOverLay from 'Components/Loading/LoadingOverLay';
import routes from './Routes';
import LoginPage from 'Page/Login/LoginPage';
import RefreshToken from 'Components/RefreshToken';
import AuthGuard from 'Lib/Guards/AuthGuard';
import { eventEmitter } from 'Lib/Api/api-client';
import { config } from 'config';
const CompilationList = React.lazy(() => import('Page/Compilation/CompilationList/CompilationList'));
const TilesList = React.lazy(() => import('Page/Tiles/TilesList/TilesList'));
const VideoList = React.lazy(() => import('Page/Videos/VideoList/VideoList'));

export default function AppRoutes() {
  const navigate = useNavigate();
  useEffect(() => {
    eventEmitter.on(config.emitter.tokenIncorrect, () => {
      navigate(routes.login.path);
    });
  }, []);

  return (
    <div>
      <RefreshToken />
      <Suspense fallback={<LoadingOverLay />}>
        <Routes>
          <Route path={routes.login.path} element={<LoginPage />} />

          <Route path={routes.compilationList.path} element={<AuthGuard />} >
            <Route path={routes.compilationList.path} element={<CompilationList />} />
            <Route path={routes.tilesList.path} element={<TilesList />} />
            <Route path={routes.videoList.path} element={<VideoList />} />
          </Route>

        </Routes>
      </Suspense>
    </div>
  );
}
