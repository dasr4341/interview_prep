import { dashboardRoutes } from './DashboardRoutes';
import { uiRoutes } from './UiRoutes';

export const routes = {
  home: {
    path: '/',
  },
  login: {
    path: '/login'
  },
  logout: {
    path: '/logout'
  },
  forgetPassword: {
    path: '/forget-password'
  },
  register: {
    path: '/register'
  },
  app: {
    path: '/app',
  },
  dashboard: dashboardRoutes,
  uiRoutes: uiRoutes
};

export default routes;
