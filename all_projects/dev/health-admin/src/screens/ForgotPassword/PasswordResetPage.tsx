
import { useEffect, useState } from 'react';
import './_forget-passwordPage.scoped.scss';
import ForgetPasswordHeader from './components/ForgetPasswordHeader';
import { ErrorMessage, SuccessMessage } from 'components/ui/error/ErrorMessage';
import CustomInputField from 'components/Input/CustomInputField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { routes } from 'routes';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'components/ui/button/Button';
import * as yup from 'yup';
import { AdminCheckExpiredForgotPasswordLink, AdminCheckExpiredForgotPasswordLinkVariables, AdminForgotPassword, AdminForgotPasswordVariables, 
  CheckExpiredForgotPasswordLink, CheckExpiredForgotPasswordLinkVariables } from 'health-generatedTypes';
import catchError, { getGraphError } from '../../lib/catch-error';
import PassWordValidation from './components/PassWordValidation';
import Footer from './components/Footer';
import messagesData from 'lib/messages';
import { passwordValidation } from 'lib/validation/password-validation';
import { useLazyQuery, useMutation } from '@apollo/client';
import { adminForgetPasswordMutation } from 'graphql/AdminForgetPassword.mutation';
import { checkExpiredForgotPassword } from 'graphql/checkExpiredForgotPassword.query';
import { checkAdminExpiredLink } from 'graphql/checkExpiredAdminLink.query';
import { getRedirectUrl, setAuthToken } from 'lib/api/users';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { AppEvents } from 'interface/app.events';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { axiosClient } from 'axios-api/axiosClient';
import { LoginResponse } from 'interface/auth.interface';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';

interface ForgetPasswordFormFields {
  password: string;
  repeatPassword: string;
}

const forgetPasswordSchema = yup.object().shape({
  password: passwordValidation,
  repeatPassword: yup.string().oneOf([yup.ref('password'), null], messagesData.errorList.matchPassword),
});

interface ResetPasswordStateInterface {
  loading: boolean;
  error?: null | string
}

interface ForgetPasswordResponse {
  data: JSON;
  message: LoginResponse;
}

export function PasswordResetPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isBlur, setIsBlur] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordSetMsg, setPasswordSetMsg] = useState<string>();
  const user = useAppSelector((state) => state.auth.user);
  const actionCompleted = useAppSelector((state) => state.app.appEvents);

  const [resetPasswordState, setResetPasswordState] = useState<ResetPasswordStateInterface>({ loading: false });

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ForgetPasswordFormFields>({
    resolver: yupResolver(forgetPasswordSchema),
  });

  watch('password');

  const [checkAdminLinkExpire] = useLazyQuery<
  AdminCheckExpiredForgotPasswordLink, AdminCheckExpiredForgotPasswordLinkVariables
  >(checkAdminExpiredLink, { 
    onError: (e) => {
      catchError(e, true);
      navigate(routes.owner.login.match);
    }
  });

  const [checkLinkExpire] = useLazyQuery<
  CheckExpiredForgotPasswordLink,
  CheckExpiredForgotPasswordLinkVariables
  >(checkExpiredForgotPassword, { 
    onError: (e) => {
      catchError(e, true);
      navigate(routes.login.match);
    }
  });

  async function resetPasswordRest(forgetPasswordToken: string, newPassword: string) {
    try {
      setResetPasswordState({ loading: true });
      const res:ForgetPasswordResponse = await axiosClient.post('/pretaa-health-forgot-password', { newPassword, forgotPwToken: forgetPasswordToken });
      const data = res.message;
      setPasswordSetMsg(data.message);
      setAuthToken({ token: String(data?.loginToken), refreshToken: String(data?.refreshToken) });
      dispatch(authSliceActions.getCurrentUser());
    } catch (e: any ) {
      setResetPasswordState((state) => ({ ...state, error: e?.message }));
    } finally {
      setResetPasswordState((state) => ({ ...state, loading: false }));
    }
  }

  const [adminResetPasswordHandler, { loading: adminResetPasswordLoading, error: adminResetPasswordErrors, data: adminResetPasswordState }] =
    useMutation<AdminForgotPassword, AdminForgotPasswordVariables>(adminForgetPasswordMutation, {
      onCompleted: (data) => {
        if (data.pretaaHealthAdminForgotPassword) {
          setTimeout(() => {
            navigate(routes.logout.match);
          }, 5000);
        }
      },
    });

  function onSubmit(data: ForgetPasswordFormFields ) {
    if (location.pathname.includes(routes.adminPasswordReset.build(String(token)))) {
      adminResetPasswordHandler({
        variables: {
          forgotPwToken: String(token),
          newPassword: data.password,
        }
      });
    } else {
      resetPasswordRest(String(token), data.password);
    }
  }

  useEffect(() => {
    if (location.pathname.includes(routes.adminPasswordReset.build(String(token)))) {
      checkAdminLinkExpire({
        variables: {
          forgotPwToken: String(token)
        }
      });
    } else {
      checkLinkExpire({
        variables: {
          forgotPwToken: String(token)
        }
      });
    }
    
  // 
  }, []);

  useEffect(() => {
    if (user && actionCompleted === AppEvents.LOGIN_SUCCESSFUL) {
      const url = getRedirectUrl(user);
      dispatch(appSliceActions.setAppEvents(null));
      navigate(url, { replace: true });
    }
  }, [user?.pretaaHealthCurrentUser.id, actionCompleted]);

  return (
    <div className="bg-gray-50 h-screen overflow-y-auto">
      <ForgetPasswordHeader className="md:h-2/5" />
      <form
        className="space-y-6 bg-gray-50 pt-6 md:pt-10 flex flex-col max-w-sm md:w-96 mx-auto px-5"
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => clearErrors('repeatPassword')}>
        <div className="font-medium form-header text-gray-150">Set new password</div>
        <div
          className="font-normal form-sub-header text-left 
          md:text-justify text-gray-150">
          Enter your new password and press save. New password must be different from previous passwords. Password needs
          to be at least 8 characters in length. Contain 1 upper case letter (A-Z), 1 lower case letter (a-z), Numbers
          (0-9) and a special character.
          <br />
          <br />
          Passwords must change every 90 days.
        </div>

        <fieldset className="flex flex-col mt-6 space-y-6 mb-10">
          <CustomInputField
            onBlur={() => setIsBlur(true)}
            label="New password"
            placeholder='Enter New password'
            autoFocus={true}
            type={passwordShown ? 'text' : 'password'}
            register={register('password')}
            error={Boolean(errors.password?.message)}
          />
          {errors.password?.message && <ErrorMessage message={errors.password?.message} testId="email-error" />}
          {isBlur && getValues('password') && getValues('password').length > 0 && (
            <PassWordValidation password={getValues('password')} />
          )}

          <CustomInputField
            label="Confirm password"
            placeholder='Enter Confirm password'
            type={passwordShown ? 'text' : 'password'}
            register={register('repeatPassword')}
            error={Boolean(errors.password?.message)}
          />
          {errors.repeatPassword?.message && (
            <ErrorMessage message={errors.repeatPassword.message} testId="email-error" />
          )}
          <div>
            <Button
              type="button"
              size="xs"
              buttonStyle="no-outline"
              align="left"
              classes={['text-xs md:font-sm']}
              onClick={() => setPasswordShown(!passwordShown)}>
              {passwordShown ? 'Hide Password' : 'Show Password'}
            </Button>
          </div>
        </fieldset>

        <Button
          loading={resetPasswordState.loading || adminResetPasswordLoading}
          disabled={resetPasswordState.loading || adminResetPasswordLoading}
          classes={['mb-2']}>
          Save
        </Button>
        {isValid && resetPasswordState.error && (
          <ErrorMessage message={resetPasswordState.error} />
        )}
        {isValid && adminResetPasswordErrors && (
          <ErrorMessage message={getGraphError(adminResetPasswordErrors.graphQLErrors).join(',')} />
        )}
        {passwordSetMsg && <SuccessMessage message={passwordSetMsg} />}
        {adminResetPasswordState?.pretaaHealthAdminForgotPassword && <SuccessMessage message={messagesData.successList.passwordUpdate} />}
      </form>
      <Footer>
        <Button
          onClick={() => navigate(routes.login.match)}
          text="Return to sign in"
          type="button"
          size="xs"
          buttonStyle="no-outline"
          align="left"
          classes={['text-xs md:font-sm']}
        />
      </Footer>
    </div>
  );
}
