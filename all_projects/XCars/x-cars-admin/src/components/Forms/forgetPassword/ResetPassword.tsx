'use client';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RxEyeOpen } from 'react-icons/rx';
import { TbEyeClosed } from 'react-icons/tb';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import forgotPasswordSchema from './forgetPassword.validation';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import {
  FORGET_PASSWORD_VERIFY_TOKEN,
  RESET_PASSWORD,
} from '@/graphql/forgetPasswordEmailVerification.mutation';
import { toast } from 'react-toastify';
import catchError from '@/lib/catch-error';
import { routes } from '@/config/routes';
import InvalidLink from './InvalidLink';
import { message } from '@/config/message';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const togglePasswordVisibility = (
    setState: Dispatch<SetStateAction<boolean>>
  ) => {
    setState((prevState) => !prevState);
  };

  const methods = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const [
    verifyToken,
    { data: verifyData, loading: verifyLoading, error: verifyError },
  ] = useMutation(FORGET_PASSWORD_VERIFY_TOKEN, {
    onError: (e) => {
      catchError(e, true);
    },
  });

  const [resetPassword, { loading: resetLoading }] = useMutation(
    RESET_PASSWORD,
    {
      onCompleted: (d) => {
        toast.success(d.adminSetForgetPassword.message);
        router.replace(routes.login.path);
      },
      onError: (e) => catchError(e, true),
    }
  );

  const handleChangePassword = (formData: {
    confirmPassword: string;
    password: string;
  }) => {
    if (!verifyData?.adminForgetPasswordEmailVerification.token) {
      console.error(message.wrongPattern('token'));
      router.replace(routes.login.path);
    } else {
      resetPassword({
        variables: {
          newPassword: formData.password,
          token: verifyData?.adminForgetPasswordEmailVerification.token,
        },
      });
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken({
        variables: {
          token: token,
        },
      });
    } else router.replace(routes.resetPassword.path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {verifyLoading && (
        <div className="min-h-screen flex flex-1 items-center justify-center">
          <div className="animate-spin mx-auto rounded-full h-20 w-20 border-t-1 border-gray-900"></div>
          <p className="text-center font-light mt-2 text-gray-700">
            Verifying your Email, Please Wait...
          </p>
        </div>
      )}
      {verifyError &&
        !verifyLoading &&
        !verifyData?.adminForgetPasswordEmailVerification.token && (
          <InvalidLink />
        )}
      {verifyData?.adminForgetPasswordEmailVerification.token && (
        <div className="min-h-screen flex flex-1 items-center justify-center">
          <div className="shadow-lg md:min-w-96 px-10 py-8 rounded-lg">
            <div className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 my-6">
              Change Password
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <FormProvider {...methods}>
                <form
                  className="space-y-6"
                  onSubmit={methods.handleSubmit(handleChangePassword)}
                >
                  <Input
                    id="Password"
                    placeholder="Enter your password here"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                  >
                    {showPassword ? (
                      <RxEyeOpen
                        onClick={() =>
                          togglePasswordVisibility(setShowPassword)
                        }
                        size={'25px'}
                        color="#d2d4d3"
                      />
                    ) : (
                      <TbEyeClosed
                        onClick={() =>
                          togglePasswordVisibility(setShowPassword)
                        }
                        size={'25px'}
                        color="#d2d4d3"
                      />
                    )}
                  </Input>

                  <Input
                    id="Confirm Password"
                    placeholder="Enter your password here"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                  >
                    {showConfirmPassword ? (
                      <RxEyeOpen
                        onClick={() =>
                          togglePasswordVisibility(setShowConfirmPassword)
                        }
                        size={'25px'}
                        color="#d2d4d3"
                      />
                    ) : (
                      <TbEyeClosed
                        onClick={() =>
                          togglePasswordVisibility(setShowConfirmPassword)
                        }
                        size={'25px'}
                        color="#d2d4d3"
                      />
                    )}
                  </Input>

                  <div className="my-6">
                    <Button
                      disabled={resetLoading}
                      loading={resetLoading}
                      className="w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 my-6"
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
