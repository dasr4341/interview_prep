/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import Button from 'components/ui/button/Button';
import { SSOSettings } from 'interface/SsoSettings.interface';
import catchError from '../../lib/catch-error';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { config } from 'config';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { clearLastViewUrl, getRedirectAuth } from 'lib/redirect-auth';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import restApi from 'lib/rest-client';

interface IFormInputs {
  email: string;
  password: string;
  otp: string;
}

export function LoginScreen(): JSX.Element {
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();
  const [isSsoUser, setSsoUser] = useState(false);
  const [SsoSettings, setSsoSettings] = useState<SSOSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckedSso, setIsCheckedSso] = useState(false);
  const [isCheckPassword, setIsCheckPassword] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [isotp, setOpt] = useState('');
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);
  const twoFactorAuthToken = useSelector((state: RootState) => state.auth.twoFactorAuthToken);
  const loginError = useSelector((state: RootState) => state.auth.loginError);
  const dispatch = useDispatch();


  const loginSchema = yup.object().shape({
    email: yup.string().required().email(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm<IFormInputs>({
    resolver: yupResolver(loginSchema) as unknown as any,
  });


  watch('email');

  async function checkSso(email: string) {
    try {
      setError(null);
      setLoading(true);
      try {
        const data = await restApi.pretaaGetSSOUser({ email: email.trim() });
        console.log(data);
        setLoading(false);

        if (data.data && data.data.domain) {
          setSsoUser(true);
          setSsoSettings(data.data);
        } else {
          setIsCheckPassword(true);
        }

      } catch (err: any) {
        console.log(err);
        setError(err.message);
        setIsCheckPassword(false);
        setLoading(false);
      }
      setIsCheckedSso(true);
    } catch (e) {
      catchError(e, true);
      setLoading(false);
    }
  }

  async function login(formInputs: IFormInputs) {
    localStorage.removeItem(config.storage.impersonation_mode);
    if (!isCheckPassword) {
      await checkSso(getValues('email'));
    }
    if (!isCheckedSso) {
      return;
    }

    if (isSsoUser) {
      navigate(`/okta?${queryString.stringify({ ...SsoSettings, email: formInputs.email })}`);
    } else {
      try {
        setLoading(true);
        if (!twoFactorAuthToken) {
          dispatch(authSliceActions.login(formInputs));
        } else {
          dispatch(authSliceActions.verifyOtp({ twoFactorAuthToken: twoFactorAuthToken, otp: Number(formInputs.otp) }));
        }
        setLoading(false);
      } catch (e) {
        catchError(e, true);
      }
    }
  }

  const onSubmit = (data: IFormInputs) => login(data);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleChange = (value: string) => {
    const inputValue = value.replace(/[^0-9]/g, '');
    setOpt(inputValue);
  };

  // UseEffect 
  useEffect(() => {
    setError(loginError);
  }, [loginError]);
  
  useEffect(() => {
    if (user?.id) {
      const url = getRedirectAuth({ user });
      if (url) {
        navigate(url);
        clearLastViewUrl();
      }
    }
  }, [user]);
  
  return (
    <div className="bg-gray-50 h-screen">
      <div
        className="bg-primary-light w-100 h-1/2 flex 
        justify-center items-end px-4 pb-8 md:pb-14 xl:pb-24">
        <img src="./pretaa-logo.png" alt="logo" width="346" height="105" className="inline-block object-contain" />
      </div>
      <div className="bg-gray-50 pt-6 md:pt-12 pb-4 ">
        <form className="flex flex-col mx-auto space-y-7 px-4 max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="flex flex-col space-y-4">
            {!twoFactorAuthToken && (
              <input
                data-testid="email"
                className="input placeholder-black-500 text-base"
                placeholder="Email"
                autoFocus={true}
                type="email"
                {...register('email')}
                onKeyUp={() => {
                  setIsCheckedSso(false);
                  setIsCheckPassword(false);
                  setSsoSettings(null);
                  setSsoUser(false);
                }}
              />
            )}
            {error && <ErrorMessage message={error} />}
            <ErrorMessage message={errors.email?.message ? errors.email?.message : ''} testId='email-error' />
            {!isSsoUser && isCheckedSso && !twoFactorAuthToken && (
              <>
                <input
                  data-testid="password"
                  className="input placeholder-black-500 text-base"
                  placeholder="Password"
                  type={passwordShown ? 'text' : 'password'}
                  {...register('password')}
                />
                <ErrorMessage message={errors.password?.message ? errors.password?.message : ''} testId='password-error'/>
                <Button type="button" style="no-outline" size="xs"
                        align="left"
                        classes="my-3"
                        onClick={togglePassword}>
                  {passwordShown ? 'Hide Password' : 'Show Password'}
                </Button>
              </>
            )}
            {twoFactorAuthToken && (
              <input
                data-testid="otp"
                className="input placeholder-black-500 text-base"
                placeholder="Please enter your OTP"
                type="text"
                value={isotp}
                maxLength={6}
                {...register('otp')}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </fieldset>
          {isCheckedSso && twoFactorAuthToken && (
            <Button disabled={loading} loading={loading} testId='submit-btn'>
              Verify Otp
            </Button>
          )}
          {isCheckedSso && !twoFactorAuthToken && (
            <Button disabled={loading} loading={loading} testId='submit-btn'>
              {isSsoUser ? 'Login With SSO' : 'Sign In'}
            </Button>
          )}
          {!isCheckedSso && (
            <Button disabled={loading} loading={loading} testId="continue-btn">
              {twoFactorAuthToken ? 'Verify Otp' : 'Continue'}
            </Button>
          )}
          {!isSsoUser && !twoFactorAuthToken && (
          <div className="flex pt-2">
            <Link
              to={routes.forgetPassword.match}
              className="text-gray-700 text-base 
                underline font-medium hover:text-black">
              Forgot Password
            </Link>
          </div>
          )}
        </form>
      </div>
    </div>
  );
}
