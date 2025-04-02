'use client';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { TbEyeClosed } from 'react-icons/tb';
import { RxEyeOpen } from 'react-icons/rx';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from './login.validation';
import { ILogin } from './login.interface';
import { ADMIN_LOGIN } from '@/graphql/login.mutation';
import { useMutation } from '@apollo/client';
import {
  AdminLoginMutation,
  AdminLoginMutationVariables,
} from '@/generated/graphql';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { toast } from 'react-toastify';
import { setAppData } from '@/lib/appData';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const methods = useForm({
    resolver: yupResolver<ILogin>(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const router = useRouter();

  const [loginIn, { loading, error }] = useMutation<
    AdminLoginMutation,
    AdminLoginMutationVariables
  >(ADMIN_LOGIN, {
    onCompleted: async (d) => {
      if (d.adminLogin.signInToken) {
        const { accessToken, refreshToken } = d.adminLogin.signInToken;
        await setAppData({ token: accessToken, refreshToken });
        toast.success(d.adminLogin.message);
        setTimeout(() => {
          router.replace(routes.dashboard.path);
        }, 100);
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = (formData: ILogin) => {
    loginIn({
      variables: {
        email: formData.email,
        password: formData.password,
      },
    });
  };

  return (
    <div className=" min-h-screen flex flex-1 items-center justify-center bg-white ">
      <div className="shadow-lg md:min-w-96 px-10 py-8 rounded-lg bg-white">
        <div className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900  my-6">
          Sign In
        </div>

        <div className=" sm:mx-auto sm:w-full sm:max-w-sm mb-10">
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div>
                <Input id="Email" name="email" placeholder="example@domin.com">
                  <MdEmail size={'25px'} color="#d2d4d3" />{' '}
                </Input>
              </div>

              <div>
                <div className="flex md:flex-row flex-col md:tems-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link
                      href={routes.resetPassword.path}
                      className="font-medium underline text-blue-600 hover:text-blue-500 ms-auto"
                    >
                      Forgot password
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="Enter your password here"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                  >
                    {showPassword ? (
                      <RxEyeOpen
                        className=" hover:cursor-pointer"
                        onClick={togglePasswordVisibility}
                        size={'25px'}
                        color="#d2d4d3"
                      />
                    ) : (
                      <TbEyeClosed
                        className=" hover:cursor-pointer"
                        onClick={togglePasswordVisibility}
                        size={'25px'}
                        color="#d2d4d3"
                      />
                    )}
                  </Input>
                </div>
              </div>

              <div>
                <Button
                  loading={loading}
                  disabled={loading}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 "
                >
                  Sign in
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-10 text-center text-sm text-gray-500">
            {error?.message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
