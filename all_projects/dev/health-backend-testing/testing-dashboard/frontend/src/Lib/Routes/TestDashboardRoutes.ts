import { dashboardRoutes } from './DashboardRoutes';
import { SourceSystemTypesEnum } from 'config';

export const testDashboardRoutes = {
  testMatchingPath: `${dashboardRoutes.path}/test-ui`,
  list: {
    path: 'test-ui-features',
    fullPath: `${dashboardRoutes.path}/test-ui-features`,
    build: () =>
      `${dashboardRoutes.path}/test-ui-features`,
  },
  reportTest: {
    path: 'test-ui-report',
    fullPath: `${dashboardRoutes.path}/test-ui-report`,
    build: () =>
      `${dashboardRoutes.path}/test-ui-report`,
  },
  schedulerFrequencyTest: {
    path: 'scheduler-execution',
    fullPath: `${dashboardRoutes.path}/scheduler-execution`,
    build: () =>
      `${dashboardRoutes.path}/scheduler-execution`,
  },
  sourceSystem: {
    kipu: {
      path: 'source-system',
      fullPath: `${dashboardRoutes.path}/source-system/${SourceSystemTypesEnum.KIPU}`,
    },
    ritten: {
      path: 'source-system',
      fullPath: `${dashboardRoutes.path}/source-system/${SourceSystemTypesEnum.RITTEN}`,
    }
  },
};