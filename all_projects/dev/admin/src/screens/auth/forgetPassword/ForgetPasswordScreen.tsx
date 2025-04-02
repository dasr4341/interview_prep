/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import LoginHeader from 'components/LoginHeader';
import Button from 'components/ui/button/Button';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CircledEmail from '../../../assets/images/email-icon-circle.svg';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { successList } from '../../../lib/message.json';
import './forget-password.scoped.scss';
import { useDispatch } from 'react-redux';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { resetState } from 'lib/api/users';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import restApi from 'lib/rest-client';

interface ForgetPwd {
  email: string;
}

export default function ForgetPasswordScreen() {
  const location = useLocation();
  const [passWord, setPassWord] = useState(false);
  const [isSSO, setIsSSO] = useState(false);
  const [prevEmail, setPrevEmail] = useState<string | null>(null);

  const forgetPwdSchema = yup.object().shape({
    email: yup.string().required().email(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ForgetPwd>({
    resolver: yupResolver(forgetPwdSchema) as any,
  });
  watch('email');

  const dispatch = useDispatch();



  useEffect(() => {
    resetState();
    dispatch(authSliceActions.setAdmin(null));
    dispatch(authSliceActions.setUser(null));
  }, []);

  const handelResetLink = async ({ email }: { email: string }) => {
    try {
      let data = null;
      if (location?.pathname.includes('super-admin')) {
        data = await restApi.adminForgetPasswordLink({ email });
      } else {
        data = await restApi.forgetPasswordLink({ email });
      }
      if (data) {
        setPassWord(true);
        setPrevEmail(email);
      }
    } catch (e: any) {
      catchError(e, true);
      toast.error(e.message);
    }
  };

  const onSubmit = async ({ email }: { email: string }) => {
    if (location?.pathname.includes('super-admin')) {
      handelResetLink({ email });
    } else {
      const { data } = await restApi.pretaaGetSSOUser({ email: email.trim() });
      setIsSSO(false);
      if (data.domain) {
        setIsSSO(true);
        return;
      } else {
        handelResetLink({ email });
      }
    }
  };

  const resend = async () => {
    try {
      if (location?.pathname.includes('super-admin')) {
        await restApi.adminForgetPasswordLink({ email: String(prevEmail) });
      } else {
        await restApi.forgetPasswordLink({ email: String(prevEmail) });
      }
      toast.success(successList.resend);
    } catch (e) {
      catchError(e, true);
    }

  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <LoginHeader />

      <ContentFrame classes={['pb-0 flex-1']}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div
            className={`${passWord ? 'border-b' : 'border-b-0'}
         border-gray-350`}>
            <div
              className="pt-10 pb-6 xl:pt-28 md:w-96
          md:mx-auto px-5">
              {!passWord && (
                <>
                  <h3
                    className="text-gray-150
                mb-3 xl:mb-5 text-center header-text">
                    Forgot your password?
                  </h3>

                  <p className="text-gray-150 mb-8 text-center sub-text">
                    Enter your registered email below to <br />
                    receive your password reset instructions
                  </p>
                </>
              )}

              {passWord && (
                <div className="flex flex-col items-center">
                  <img src={CircledEmail} alt="email" width="152" height="152" />

                  <h3
                    className="text-md xl:text-lg text-gray-150
                mb-3 mt-6 xxl:mt-12 xxl:mb-20 text-center">
                    Email has been sent!
                  </h3>

                  <p className="text-base text-gray-150 mb-5 text-center">
                    Please check your inbox and click the link <br />
                    to reset your password
                  </p>
                </div>
              )}

              <div className="flex flex-col">
                {!passWord && (
                  <>
                    <input
                      type="email"
                      className="input placeholder-black-500
                    text-base bg-gray-50 mb-1"
                      placeholder="Email Address"
                      autoFocus={true}
                      {...register('email')}
                    />

                    <ErrorMessage message={errors.email?.message ? errors.email?.message : ''} />
                    {isSSO && <ErrorMessage message="Please change your password in SSO website" />}

                    <p className="text-sm text-gray-150 mt-4">
                      Remember password?
                      <Link
                        to={
                          location?.pathname.includes('super-admin') ? routes.superUserLogin.match : routes.login.match
                        }
                        className="underline font-medium pl-2 
                        hover:text-pt-blue-300">
                        Log In
                      </Link>
                    </p>
                  </>
                )}
                {!passWord && <Button text="Reset Password" loading={isSubmitting} disabled={isSubmitting} classes="mt-6" />}
                {passWord && (
                  <Link
                    to={location?.pathname.includes('super-admin') ? routes.superUserLogin.match : routes.login.match}
                    className="mt-6 mb-4 xl:mt-12 xl:mb-8
              bg-primary-light rounded-xl p-2 flex justify-center text-white">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
          {passWord && (
            <div
              className="py-5 md:w-96 md:mx-auto flex flex-col
         px-5 xl:pb-14">
              <p className="text-sm text-gray-150 mb-4 ">Didn’t receive the link?</p>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                size="xs"
                style="no-outline"
                align="left"
                classes="font-medium hover:text-pt-blue-300
              text-sm"
                onClick={resend}>
                Resend
              </Button>
            </div>
          )}
        </form>
      </ContentFrame>
    </div>
  );
}
