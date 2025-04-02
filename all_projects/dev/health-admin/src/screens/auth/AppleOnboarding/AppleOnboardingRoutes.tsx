import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';

import { routes } from 'routes';

const AppleOnboardingView = lazyWithPreload(() => import('./AppleOnboardingView'));
const AppleOnboardingPage = lazyWithPreload(() => import('./AppleOnboardingPage'));

export const appleOnboardingRoutesPreload = [AppleOnboardingView, AppleOnboardingPage];


export const AppleOnboardingRoutes = [
  <Route
    path={routes.home.match}
    key="AppleOnboarding">
    <Route
      path={routes.appleOnboarding.view.match}
      element={<AppleOnboardingView />}>
      <Route
        path={routes.appleOnboarding.connect.match}
        element={<AppleOnboardingPage />}
      />
    </Route>
  </Route>,
];

