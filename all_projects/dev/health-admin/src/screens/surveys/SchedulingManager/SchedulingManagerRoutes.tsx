import AppPermissionGuard from 'guards/AppPermissionGuard';
import { UserPermissionNames } from 'health-generatedTypes';
import { CapabilitiesType } from 'lib/getPrivilege';
import React from 'react';
import { Route } from 'react-router-dom';
import lazyWithPreload from 'react-lazy-with-preload';

import { routes } from 'routes';

const SchedulingManagerList = lazyWithPreload(() => import('screens/surveys/SchedulingManager/SchedulingManagerList'));
const ScheduleManagerDetailLayoutView = lazyWithPreload(
  () => import('screens/surveys/SchedulingManager/ScheduleManagerDetailLayoutView')
);
const PostCompletionAndReoccurring = lazyWithPreload(
  () => import('screens/surveys/SchedulingManager/SchedulingManagerDetail')
);
const SchedulingCampaign = lazyWithPreload(
  () => import('screens/surveys/SchedulingManager/SchedulingCamapaign/SchedulingCampaign')
);
const SurveyStats = lazyWithPreload(() => import('screens/surveys/SchedulingManager/AssesmentStats/SurveyStats'));

export const schedulerRoutesPreload = [
  SchedulingManagerList,
  ScheduleManagerDetailLayoutView,
  PostCompletionAndReoccurring,
  SchedulingCampaign,
  SurveyStats
];


export const SchedulingManagerRoutes = [
  <Route key="Schedule">
    <Route
      element={
        <AppPermissionGuard privileges={UserPermissionNames.CAMPAIGN_SCHEDULER} capabilitiesType={CapabilitiesType.CREATE} />
      }>
      <Route path={routes.scheduleManagerDetail.scheduleCampaign.match} element={<SchedulingCampaign />} />
      <Route path={routes.scheduleManagerDetail.duplicateCampaign.match} element={<SchedulingCampaign />} />
    </Route>
    

    <Route
      element={
        <AppPermissionGuard privileges={UserPermissionNames.CAMPAIGN_SCHEDULER}  />
      }>
      <Route path={routes.scheduleManagerDetail.editCampaign.match} element={<SchedulingCampaign />} />
      <Route path={routes.scheduleManagerDetail.surveyStats.match} element={<SurveyStats />} />
    </Route>

    <Route
      element={
        <AppPermissionGuard privileges={UserPermissionNames.CAMPAIGN_SCHEDULER}  />
      }>
      <Route path={routes.schedulingManagerList.match} element={<SchedulingManagerList />} />
      <Route path={routes.scheduleManagerDetail.list.match} element={<ScheduleManagerDetailLayoutView />}>
        <Route path={routes.scheduleManagerDetail.listCampaigns.match} element={<PostCompletionAndReoccurring />} />
      </Route>
    </Route>
  </Route>,
];
