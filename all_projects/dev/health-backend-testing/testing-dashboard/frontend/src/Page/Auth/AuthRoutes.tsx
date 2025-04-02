import React from 'react';
import { Route } from 'react-router-dom';
import routes from '../../Lib/Routes/Routes';

const LoginPage = React.lazy(() => import('../../Page/Auth/Login/LoginPage'));
const ForgetPassword = React.lazy(() => import('../../Page/Auth/ForgetPassword/ForgetPassword'));
const RegisterPage = React.lazy(() => import('../../Page/Auth/Register/RegisterPage'));
const LogoutPage = React.lazy(() => import('../../Page/Auth/LogoutPage'));

export const AuthRoutes = [
  <Route key="AuthRoutes">
    <Route path={routes.login.path} element={<LoginPage />} />
    <Route path={routes.forgetPassword.path} element={<ForgetPassword />} />
    <Route path={routes.register.path} element={<RegisterPage />} />
    <Route path={routes.logout.path} element={<LogoutPage />} />
  </Route>
];


  