import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';

import { routes } from 'routes';

const PatientSurveyListLayout = lazyWithPreload(() => import('screens/Patient/PatientSurveys/PatientSurveyListLayout'));
const OpenOrCompletedSurvey = lazyWithPreload(() => import('screens/Patient/PatientSurveys/OpenOrCompletedSurvey'));
const SurveyFormSubmitted = lazyWithPreload(() => import('screens/surveys/Patient/SurveyFormSubmitted'));

export const patientSurveyRoutePreload = [
  PatientSurveyListLayout,
  OpenOrCompletedSurvey,
  SurveyFormSubmitted
];

export const PatientSurveyRoutes = [
  <Route key="Assessments">
    <Route path={routes.patientSurvey.surveyList.match} element={<PatientSurveyListLayout />}>
      <Route path={routes.patientSurvey.openOrCompletedSurvey.match} element={<OpenOrCompletedSurvey />} />
    </Route>

    {/* routes for events details */}
    <Route path={routes.eventAssessmentsPage.eventAssessmentList.match} element={<PatientSurveyListLayout />}>
      <Route path={routes.eventAssessmentsPage.eventOpenOrCompletedAssessment.match} element={<OpenOrCompletedSurvey />} />
    </Route>
   
    <Route path={routes.eventAssessmentsPage.eventSubmittedAssessment.match} element={<SurveyFormSubmitted />} />
    {/* routes for events details end */}

    <Route path={routes.patientSurvey.submittedSurvey.match} element={<SurveyFormSubmitted />} />
  </Route>,
];
