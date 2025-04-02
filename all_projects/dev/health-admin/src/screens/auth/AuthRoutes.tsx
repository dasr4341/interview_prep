import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';
import { routes } from 'routes';
const FitbitOnboarding = lazyWithPreload(() => import('./FitbitOnboarding/FitbitOnboarding'));

export const authRoutesPreload = [
  FitbitOnboarding,
];

export const AuthRoutes =  [
  <Route key="authenticateWithFhs" path={routes.authenticateWithFhs.match} element={<FitbitOnboarding />} />
];