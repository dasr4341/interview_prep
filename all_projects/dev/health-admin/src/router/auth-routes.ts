import { buildUrl, makeRoute } from "./lib-router";

export const authRoutes = {
  // Auth
  registerSupporter: makeRoute('/invitation/:token', {
    name: 'Register Supporter',
    build: (token: string) => `/invitation/${token}`,
  }),
  login: makeRoute('/login', { name: 'LOGIN' }),
  unauthorized: makeRoute('/unauthorized', { name: 'UNAUTHORIZED' }),
  unreachable: makeRoute('/unreachable', { name: 'UNREACHABLE' }),
  logout: {
    name: 'LOGOUT',
    match: '/logout',
    label: 'Logout',
    buildUrl: (query: { userType?: string }) => buildUrl('/logout', query),
  },
  forgetPassword: makeRoute('/forgot_password', { name: 'ForgotPassword' }),
  adminForgetPassword: makeRoute('/pretaa-admin/forgot_password', {
    name: 'AdminForgotPassword',
  }),
  adminPasswordReset: makeRoute('/pretaa-admin/forgot_password/:token', {
    build: (tokenId: string) => `/pretaa-admin/forgot_password/${tokenId}`,
    name: 'AdminResetPassword',
  }),
  passwordReset: makeRoute('/forgot_password/:token', {
    build: (tokenId: string) => `/forgot_password/${tokenId}`,
    name: 'ResetPassword',
  }),
  setPassword: makeRoute('/welcome/:welcomeToken', {
    build: (token: string) => `/welcome/${token}`,
    name: 'SetAccountPassword',
  }),
}