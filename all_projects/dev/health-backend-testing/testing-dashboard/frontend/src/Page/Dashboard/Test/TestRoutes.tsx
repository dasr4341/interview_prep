import React from 'react';
import { Route } from 'react-router-dom';
import { testDashboardRoutes } from 'Lib/Routes/TestDashboardRoutes';
import SchedulerFrequency from './Scheduler/SchedulerFrequency';
import KipuSourceSystem from './SourceSystem/kipu/KipuSourceSystem';
import RittenSourceSystem from './SourceSystem/ritten/RittenSourceSystem';

const FeaturesList = React.lazy(() => import('../Test/FeaturesList/FeaturesList'));
const ReportsTest = React.lazy(() => import('./Reports/ReportsTest'));

export const TestUIRoutes = [
  <Route key='TestUIRoutes'>
    <Route path={testDashboardRoutes.list.fullPath} element={<FeaturesList />} />
    <Route path={testDashboardRoutes.reportTest.fullPath} element={<ReportsTest />} />
    <Route path={testDashboardRoutes.schedulerFrequencyTest.fullPath} element={<SchedulerFrequency />} />
    <Route path={testDashboardRoutes.sourceSystem.kipu.fullPath} element={<KipuSourceSystem />} />
    <Route path={testDashboardRoutes.sourceSystem.ritten.fullPath} element={<RittenSourceSystem />} />
  </Route>,
];
