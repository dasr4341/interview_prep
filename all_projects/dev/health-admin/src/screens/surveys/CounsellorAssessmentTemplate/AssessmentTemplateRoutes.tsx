import React from 'react';
import { Route } from 'react-router-dom';
import lazyWithPreload from 'react-lazy-with-preload';

import { routes } from 'routes';
import SendPatientContextForm from './component/AssessmentTemplateContext';
import AssessmentTemplateDetails from './AssessmentTemplateDetails';
import SurveyFormPreview from '../SurveyFormPreview';
import ContentHeaderContext from 'components/ContentHeaderContext';
import AppPermissionGuard from 'guards/AppPermissionGuard';
import { UserPermissionNames } from 'health-generatedTypes';

const AssessmentTemplateLayout = lazyWithPreload(
  () => import('screens/surveys/CounsellorAssessmentTemplate/AssessmentTemplateLayout')
);
const AssessmentTemplatePage = lazyWithPreload(
  () => import('screens/surveys/CounsellorAssessmentTemplate/AssessmentTemplatePage')
);
const AssessmentTemplateDetailsLayout = lazyWithPreload(
  () => import('screens/surveys/CounsellorAssessmentTemplate/AssessmentTemplateDetailsLayout')
);
const ScheduleAssessmentPage = lazyWithPreload(
  () => import('screens/surveys/CounsellorAssessmentTemplate/ScheduleAssessmentPage')
);

export const assessmentRoutesPreload = [
  AssessmentTemplateLayout,
  AssessmentTemplatePage,
  AssessmentTemplateDetailsLayout,
  ScheduleAssessmentPage
];

export const AssessmentTemplateRoutes = [
  <Route key="AssessmentTemplate" element={<AppPermissionGuard privileges={UserPermissionNames.SURVEY_TEMPLATES} />}>
    <Route
      path={routes.assessmentTemplatePreview.match}
      element={<SurveyFormPreview />}
    />
    <Route
      path={routes.counsellorAssessmentTemplate.match}
      element={
        <ContentHeaderContext>
          <AssessmentTemplateLayout />
        </ContentHeaderContext>
      }>
      <Route
        path={routes.counsellorAssessmentTemplateList.match}
        element={<AssessmentTemplatePage />}
      />
    </Route>
    <Route
      path={routes.assessmentTemplateDetailsView.match}
      element={<AssessmentTemplateDetailsLayout />}>
      <Route
        path={routes.assessmentTemplateDetails.match}
        element={<AssessmentTemplateDetails />}
      />
    </Route>
    <Route
      path={routes.assessmentScheduleCreateCampaign.match}
      element={
        <SendPatientContextForm>
          <ScheduleAssessmentPage />
        </SendPatientContextForm>
      }
    />
    <Route
      path={routes.assessmentScheduleEditCampaign.match}
      element={
        <SendPatientContextForm>
          <ScheduleAssessmentPage />
        </SendPatientContextForm>
      }
    />
    <Route
      path={routes.assessmentScheduleDuplicateCampaign.match}
      element={
        <SendPatientContextForm>
          <ScheduleAssessmentPage />
        </SendPatientContextForm>
      }
    />
  </Route>,
];
