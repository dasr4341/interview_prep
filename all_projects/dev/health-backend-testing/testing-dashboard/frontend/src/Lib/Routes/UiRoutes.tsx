import { dashboardRoutes } from './DashboardRoutes';


export const uiRoutes = {
  pageWithHeaderAndFooter: {
    path: `${dashboardRoutes.path}/page-header-footer`,
    fullPath: () => `${dashboardRoutes.path}/page-header-footer`,
  },
};