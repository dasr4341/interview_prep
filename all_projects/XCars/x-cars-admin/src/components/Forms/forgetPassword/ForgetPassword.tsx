'use client';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@apollo/client';
import { FORGET_PASSWORD_SEND_EMAIL } from '@/graphql/forgetPasswordEmailVerification.mutation';
import emailSchema from './email.validation';
import { toast } from 'react-toastify';
import catchError from '@/lib/catch-error';
import Link from 'next/link';
import { routes } from '@/config/routes';

const ForgetPassword = () => {
  const methods = useForm({
    resolver: yupResolver(emailSchema),
  });

  const [sendEmail, { loading }] = useMutation(FORGET_PASSWORD_SEND_EMAIL, {
    onCompleted: (d) => {
      toast.success(d.adminForgetPassword.message);
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  const handleSendEmail = (formData: { email: string }) => {
    sendEmail({
      variables: {
        email: formData.email,
      },
    });
  };

  return (
    <div className=" min-h-screen flex flex-col flex-1 items-center justify-center ">
      <div className="shadow-lg md:min-w-96 px-10 py-8 rounded-lg flex flex-col">
        <div className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900  my-6">
          Forgot Password?
        </div>

        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
          <FormProvider {...methods}>
            <form
              className="space-y-3"
              onSubmit={methods.handleSubmit(handleSendEmail)}
            >
              <Input
                id="Email address"
                placeholder="example@domain.com"
                name="email"
              >
                <MdEmail size={'25px'} color="#d2d4d3" />{' '}
              </Input>

              <div className="my-6">
                <Button
                  loading={loading}
                  disabled={loading}
                  className="w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600  mb-6"
                >
                  Continue
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>

        <Link
          href={routes.login.path}
          className=" text-center text-sm text-blue-600 capitalize underline"
        >
          sign in here
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
