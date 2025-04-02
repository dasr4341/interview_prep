import { uiRoutes } from 'Lib/Routes/UiRoutes';
import React from 'react';
import { Route } from 'react-router-dom';

const PageWithHeaderFooter = React.lazy(() => import('./PageWithHeaderFooter/PageWithHeaderFooter'));

export const UiRoutes = [
  <Route key='ui'>
    <Route path={uiRoutes.pageWithHeaderAndFooter.path} element={<PageWithHeaderFooter />} />
  </Route>,
];
