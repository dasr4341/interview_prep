/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import Button from 'components/ui/button/Button';
import { adminLoginQuery } from 'lib/query/user/admin-login';
import moment from 'moment';
import { AdminLogin, AdminLoginVariables } from 'generatedTypes';
import { client } from 'apiClient';
import { config } from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { RootState } from 'lib/store/app-store';
import { clearLastViewUrl, getRedirectAuth } from 'lib/redirect-auth';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';

interface IFormInputs {
  email: string;
  password: string;
}

export function SuperUserLoginScreen(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const adminUser = useSelector((state: RootState) => state.auth.admin);

  useEffect(() => {
    dispatch(authSliceActions.setUser(null));
  }, []);

  useEffect(() => {
    if (adminUser) {
      navigate(routes.controlPanelScreen.match);
      const url = getRedirectAuth({ adminUser });
      if (url) {
        navigate(url);
        clearLastViewUrl();
      }
    }
  }, [adminUser]);

  const loginSchema = yup.object().shape({
    email: yup.string().required().email(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInputs>({
    resolver: yupResolver(loginSchema) as unknown as any,
  });
  watch('email');

  async function login(formInputs: IFormInputs) {
    setLoading(true);
    const { email, password } = formInputs;

    const { data, errors: loginErrors } = await client.query<AdminLogin, AdminLoginVariables>({
      query: adminLoginQuery,
      variables: {
        email,
        password
      }
    });

    if (data) {
      localStorage.setItem(config.storage.token, data?.pretaaAdminLogin?.loginToken);
      localStorage.setItem(config.storage.refreshToken, data?.pretaaAdminLogin?.refreshToken);
      localStorage.setItem(config.storage.loginTime, JSON.stringify(moment().format('HH:mm')));
      localStorage.removeItem(config.storage.user_store);
      localStorage.removeItem(config.storage.impersonation_mode);
      dispatch(authSliceActions.getCurrentSuperAdmin());
    } else if (loginErrors && loginErrors.length) {
      setError(loginErrors[0].message);
      setLoading(false);
    }
    
  }


  const onSubmit = (data: IFormInputs) => login(data);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="bg-gray-50 h-screen">
      <div
        className="bg-primary-light w-100 h-1/2 flex 
        justify-center items-end px-4 pb-8 md:pb-14 xl:pb-24">
        <img src="../pretaa-logo.png" alt="logo" width="346" height="105" className="inline-block object-contain" />
      </div>
      <div className="bg-gray-50 pt-6 md:pt-12 pb-4 ">
        <form className="flex flex-col mx-auto space-y-7 px-4 max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="flex flex-col space-y-4">
            <input
              data-testid="email"
              className="input placeholder-black-500 text-base"
              placeholder="Email"
              autoFocus={true}
              type="email"
              {...register('email')}
            />
            
            <ErrorMessage message={errors.email?.message ? errors.email?.message : ''} testId="email-error" />
            <input
              data-testid="password"
              className="input placeholder-black-500 text-base"
              placeholder="Password"
              type={passwordShown ? 'text' : 'password'}
              {...register('password')}
            />
            <ErrorMessage message={errors.password?.message ? errors.password?.message : ''} testId="password-error" />
            <Button type="button" style="no-outline" size="xs" align="left" classes="my-3" onClick={togglePassword}>
              {passwordShown ? 'Hide Password' : 'Show Password'}
            </Button>
          </fieldset>
          <Button disabled={loading} loading={loading} testId="submit-btn">
            Sign In
          </Button>

          {error && <ErrorMessage message={error} testId="server-side-login-error" />}

          <div className="flex pt-2">
            <Link
              to={routes.superUserForgetPassword.match}
              className="text-gray-700 text-base 
                underline font-medium hover:text-black">
              Forgot Password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
