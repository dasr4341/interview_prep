import UnAuthGuard from 'guards/UnAuthGuard';
import React from 'react';
import { Route } from 'react-router-dom';
import { routes } from 'routes';
import { ForgetPasswordPage } from 'screens/ForgotPassword/ForgotPasswordPage';
import { PasswordResetPage } from 'screens/ForgotPassword/PasswordResetPage';
import { LoginScreen } from 'screens/LoginScreen/LoginScreen';

export const AuthRoutesConfig = [
  <Route
    element={<UnAuthGuard />}
    key="authRoutesConfig">
    <Route
      path={routes.login.match}
      element={<UnAuthGuard />}>
      <Route
        path={routes.login.match}
        element={<LoginScreen />}
      />
    </Route>
    <Route
      path={routes.forgetPassword.match}
      element={<ForgetPasswordPage />}
    />
    <Route
      path={routes.adminForgetPassword.match}
      element={<ForgetPasswordPage />}
    />
    <Route
      path={routes.passwordReset.match}
      element={<PasswordResetPage />}
    />
    <Route
      path={routes.adminPasswordReset.match}
      element={<PasswordResetPage />}
    />
    <Route
      path={routes.owner.setPassword.match}
      element={<PasswordResetPage />}
    />
    <Route
      path={routes.patientSetPassword.match}
      element={<PasswordResetPage />}
    />
  </Route>,
];
