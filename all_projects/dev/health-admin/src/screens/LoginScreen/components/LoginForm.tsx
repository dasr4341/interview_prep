import React, { useEffect, useState } from 'react';
import { ErrorMessage, SuccessMessage } from 'components/ui/error/ErrorMessage';
import Button from 'components/ui/button/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInputField from 'components/Input/CustomInputField';
import * as yup from 'yup';
import {
  PretaaAdminLogin,
  PretaaAdminLoginVariables,
  PretaaAdminLogin_pretaaHealthAdminLogin,
} from 'health-generatedTypes';
import { useNavigate } from 'react-router-dom';
import { client } from 'apiClient';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { routes } from 'routes';
import catchError from 'lib/catch-error';
import { PretaaHealthUserTypes } from '../LoginScreen';
import { pretaaAdminLoginQuery } from 'graphql/pretaaAdminLogin.query';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import messagesData from 'lib/messages';
import { AppEvents } from 'interface/app.events';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { getRedirectUrl, setAuthToken } from 'lib/api/users';
import { axiosClient } from 'axios-api/axiosClient';
import { LoginResponse } from 'interface/auth.interface';

interface LoginFormFields {
  email: string;
  password: string;
}
interface LoginFormState {
  loading: boolean;
  error?: string | null;
  data?:  PretaaAdminLogin_pretaaHealthAdminLogin | LoginResponse | null;
}


const loginSchema = yup.object().shape({
  email: yup.string().required(messagesData.errorList.required).email(),
  password:  yup.string()
  .trim()
  .required(messagesData.errorList.required),
});

export default function LoginForm({
  userType,
  verifyOtpForm,
  setResponse,
}: {
  userType: PretaaHealthUserTypes;
  verifyOtpForm: () => void;
  setResponse: (r:  PretaaAdminLogin_pretaaHealthAdminLogin | LoginResponse ) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState(false);
  const [currentState, setCurrentState] = useState<LoginFormState>({ loading: false, error: '', data: null });
  const user = useAppSelector((state) => state.auth.user);
  const actionCompleted = useAppSelector((state) => state.app.appEvents);
  const pretaaAdmin = useAppSelector((state) => state.auth.pretaaAdmin);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormFields>({
    resolver: yupResolver(loginSchema),
  });

  async function pretaalogin(loginCredentials: LoginFormFields) {
    setCurrentState({ loading: true });
    try {
      const response = await client.query<PretaaAdminLogin, PretaaAdminLoginVariables>({
        query: pretaaAdminLoginQuery,
        variables: loginCredentials,
      });

      if (response.data.pretaaHealthAdminLogin) {
        const pretaaHealthAdminLogin = response.data.pretaaHealthAdminLogin;
        setAuthToken({ token: String(pretaaHealthAdminLogin.loginToken), refreshToken: String(pretaaHealthAdminLogin.refreshToken) });
        dispatch(authSliceActions.getPretaaAdminUser());
        setCurrentState({ loading: false, data: pretaaHealthAdminLogin });
      }

    } catch (error) {
      const message = catchError(error);
      setCurrentState({ loading: false, error: message });
    }
  }

  async function login(loginCredentials: LoginFormFields) {
    setCurrentState({ loading: true });
    try {
      const getResponse: LoginResponse = await axiosClient.post('/user/web/login', loginCredentials);
      
      if (getResponse) {
        // twoFactorAuthentication -> is enabled, then
        if (getResponse.twoFactorAuthentication) {
          setResponse(getResponse);
          verifyOtpForm();
          return;
        }
        // if twoFactorAuthentication -> not enabled
        setAuthToken({ token: String(getResponse.loginToken), refreshToken: String(getResponse.refreshToken) });
        dispatch(authSliceActions.getCurrentUser());
        dispatch(appSliceActions.setAppLoading(false));
        setCurrentState({ loading: false, data: getResponse });
      }
    } catch (error: any) {
      console.log(error);
      setCurrentState({ loading: false, error: error.message });
    }
  }

  function onSubmit(loginCredentials: LoginFormFields) {
    if (userType === PretaaHealthUserTypes.PATIENT) {
      login(loginCredentials);
    } else if (userType === PretaaHealthUserTypes.PRETAA_ADMIN) {
      pretaalogin(loginCredentials);
    }
  }

  useEffect(() => {
    if (user) {
      navigate(getRedirectUrl(user));
    }
  // 
  }, []);

  useEffect(() => {
    console.log({user: user, actionCompleted })
    if (!user && actionCompleted === AppEvents.LOGIN_FAILED) {
      setCurrentState({ loading: false, data: null, error: 'No facilities access have been set. Please contact to Pretaa Health Support Team!' });
    } else if (user && actionCompleted === AppEvents.LOGIN_SUCCESSFUL) {
      const url = getRedirectUrl(user);
      dispatch(appSliceActions.setAppEvents(null));
      navigate(url, { replace: true });
    } else if (actionCompleted === AppEvents.LOGIN_SUCCESSFUL) {
      setCurrentState({ loading: false, data: null });
      dispatch(appSliceActions.setAppEvents(null));
    }
  }, [user?.pretaaHealthCurrentUser.id, actionCompleted]);

  useEffect(() => {
    if (pretaaAdmin?.id && actionCompleted === AppEvents.ADMIN_LOGIN_SUCCESSFUL) {
      navigate(routes.owner.clientManagement.match, { replace: true });
      dispatch(appSliceActions.setAppEvents(null));
    }
    // 
  }, [pretaaAdmin?.id, actionCompleted]);

  return (
    <form className="flex flex-col mx-auto space-y-7 max-w-sm md:w-96 md:mx-auto px-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col space-y-6">
        <CustomInputField
          label="Email"
          dataTestid="email"
          placeholder='Enter Email'
          autoFocus={true}
          type="email"
          register={register('email')}
          error={Boolean(errors.email?.message)}
        />
        {errors.email?.message && <ErrorMessage message={errors.email?.message} testId="email-error" />}

        <CustomInputField
          label="Password"
          data-testid="password"
          placeholder='Enter password'
          className="input placeholder-black-500 text-base"
          type={passwordShown ? 'text' : 'password'}
          register={register('password')}
          error={Boolean(errors.password?.message)}
        />
        {errors.password?.message && <ErrorMessage message={errors.password?.message} testId="password-error" />}
        <div>
          <Button type="button" buttonStyle="no-outline" size="xs" align="left" classes="my-3 text-more" onClick={togglePassword}>
            {passwordShown ? 'Hide Password' : 'Show Password'}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={currentState.loading  || Boolean(currentState.data && !user) || Boolean(currentState.data && !pretaaAdmin)}
        loading={currentState.loading  || Boolean(currentState.data && !user) || Boolean(currentState.data && !pretaaAdmin)}
        testId="submit-btn">
        Sign In
      </Button>

      {isValid && currentState.error && <ErrorMessage message={currentState.error} />}
    

      {(!currentState.error && currentState.data) && <SuccessMessage message="Login Successful" />}
    </form>
  );
}
