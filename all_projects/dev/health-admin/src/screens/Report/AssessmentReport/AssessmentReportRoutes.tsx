import React from 'react';
import { Route } from 'react-router-dom';
import { routes } from 'routes';
import lazyWithPreload from 'react-lazy-with-preload';

import EventOrTimeline from 'components/EventOrTimeline';
import DischargeDropDownPlaceholderProvider from './helper/DischargeDropDownPlaceholderProvider';

const AssessmentReportLayout = lazyWithPreload(() => import('./AssessmentReportLayout'));
const PatientOverView = lazyWithPreload(() => import('./PatientOverviewTemplate/PatientOverView'));
const AssessmentReportByTemplateCode = lazyWithPreload(
  () => import('./AssementReportForTemplate/AssessmentReportByTemplateCode'),
);
export const assessmentStatsRoutePreload = [AssessmentReportLayout, PatientOverView, AssessmentReportByTemplateCode];

export const AssessmentReportingRoutes = [
  <Route key="Reporting">
    <Route
      element={<DischargeDropDownPlaceholderProvider><AssessmentReportLayout /></DischargeDropDownPlaceholderProvider>}
      path={routes.assessmentsReport.reportPage.match}>
      <Route
        element={<PatientOverView />}
        path={routes.assessmentsReport.patientsOverview.match}
      />
      <Route
        element={<AssessmentReportByTemplateCode />}
        path={routes.assessmentsReport.assessmentReportByTemplateCode.match}
      />
    </Route>
    <Route
      element={<EventOrTimeline />}
      path={routes.assessmentsReport.assessmentReportTimeline.match}
    />
  </Route>,
];
