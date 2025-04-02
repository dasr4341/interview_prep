import ContentHeaderContext from 'components/ContentHeaderContext';
import AppPermissionGuard from 'guards/AppPermissionGuard';
import { UserPermissionNames } from 'health-generatedTypes';
import { CapabilitiesType } from 'lib/getPrivilege';
import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';
import { routes } from 'routes';

const MobileTemplateScreen = lazyWithPreload(() => import('screens/surveys/TemplateForFacilityAdmin/StandardTemplateScreenLayout'));
const TemplatesScreen = lazyWithPreload(() => import('screens/surveys/TemplateForFacilityAdmin/StandardTemplateScreen'));
const CreateTemplateScreen = lazyWithPreload(() => import('screens/surveys/MobileTemplateFormScreen'));
const SurveyFormPreview = lazyWithPreload(() => import('screens/surveys/SurveyFormPreview'));

export const templateRoutesPreload = [
  MobileTemplateScreen,
  TemplatesScreen,
  CreateTemplateScreen,
  SurveyFormPreview
];

export const templatesRoutes = [
  <Route key="templateRoutes">
    <Route element={<AppPermissionGuard privileges={UserPermissionNames.CAMPAIGN_SCHEDULER} />}>
      <Route
        path={routes.mobileTemplate.match}
        element={
          <ContentHeaderContext>
            <MobileTemplateScreen />
          </ContentHeaderContext>
        }>
        <Route
          path={routes.standardTemplate.match}
          element={<TemplatesScreen />}
        />
        <Route
          path={routes.customTemplate.match}
          element={<TemplatesScreen />}
        />
      </Route>
    </Route>
    <Route
      element={
        <AppPermissionGuard
          privileges={UserPermissionNames.SURVEY_TEMPLATES}
          capabilitiesType={CapabilitiesType.CREATE}
        />
      }>
      <Route
        path={routes.templateForm.match}
        element={<CreateTemplateScreen />}
      />
    </Route>
    <Route
      element={
        <AppPermissionGuard
          privileges={UserPermissionNames.SURVEY_TEMPLATES}
          capabilitiesType={CapabilitiesType.VIEW}
        />
      }>
      <Route
        path={routes.updateTemplateForm.match}
        element={<CreateTemplateScreen />}
      />
    </Route>
    <Route
      element={
        <AppPermissionGuard
          privileges={UserPermissionNames.SURVEY_TEMPLATES}
          capabilitiesType={CapabilitiesType.VIEW}
        />
      }>
      <Route
        path={routes.templateFormPreview.match}
        element={<SurveyFormPreview />}
      />
    </Route>
  </Route>,
];
