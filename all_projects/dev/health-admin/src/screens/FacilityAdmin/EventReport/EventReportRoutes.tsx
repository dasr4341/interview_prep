import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';
import { routes } from 'routes';

const EventReportPage = lazyWithPreload(() => import('screens/FacilityAdmin/EventReport/EventReportPageLayout'));
const EventReportTemplate = lazyWithPreload(() => import('screens/FacilityAdmin/EventReport/EventReportTemplate/EventReportTemplate'));

export const reportRoutesByFacilityAdminPreload = [
  EventReportPage,
  EventReportTemplate
];

export const ReportRoutesByFacilityAdmin = [
  <Route key="Reporting">
    <Route element={<EventReportPage />} path={routes.eventReport.reportPage.match}>
    <Route path={routes.eventReport.EventReportTemplate.match} element={<EventReportTemplate />} />
    </Route>
  </Route>,
];
