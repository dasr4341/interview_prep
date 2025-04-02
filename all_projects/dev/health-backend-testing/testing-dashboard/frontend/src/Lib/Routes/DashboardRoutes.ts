import { DefaultRoute } from './DefaultRoute.Interface';

export interface DashBoardRoutes {
  path: string;
  me: DefaultRoute
}

const dashboardPath = '/dashboard';

export const dashboardRoutes: DashBoardRoutes = {
  path: dashboardPath,
  me: {
    path: `${dashboardPath}/me`,
    fullPath: `${dashboardPath}/me`,
  },
};
