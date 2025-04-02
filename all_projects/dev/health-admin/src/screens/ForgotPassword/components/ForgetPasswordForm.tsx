import React, { useEffect, useState } from 'react';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import CustomInputField from 'components/Input/CustomInputField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { routes } from 'routes';
import { Link, useLocation } from 'react-router-dom';
import Button from 'components/ui/button/Button';
import * as yup from 'yup';
import { getGraphError } from '../../../lib/catch-error';
import '../_forget-passwordPage.scoped.scss';
import { AdminForgotPasswordLink,
   AdminForgotPasswordLinkVariables } from 'health-generatedTypes';
import Footer from './Footer';
import { useMutation } from '@apollo/client';
import { forgetPasswordLinkForAdmin } from 'graphql/forgetPasswordLinkForAdmin.mutation';
import { axiosClient } from 'axios-api/axiosClient';

interface ForgetPasswordFormFields {
  email: string;
}
interface ForgetPasswordStateInterface {
  loading: boolean;
  error?: null | string
}

export default function ForgetPasswordForm({ onSuccessFormSubmit }: { onSuccessFormSubmit: () => void }) {
  const location = useLocation();
  const [forgetPasswordState, setForgetPasswordState] = useState<ForgetPasswordStateInterface>({ loading: false });
  const adminForgotPasswordLocation = location.pathname.includes(routes.adminForgetPassword.match);

  let routePath: string;
  if (location.pathname === routes.adminForgetPassword.match){
    routePath =  routes.owner.login.match;
  } else {
    routePath = routes.login.match;
  }

  const forgetPasswordSchema = yup.object().shape({
    email: yup.string().required('Please enter email address to proceed').email(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ForgetPasswordFormFields>({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const [forgetPasswordForAdminHandler, { loading: adminResetPasswordLoading, error: adminResetPasswordErrors }] =
    useMutation<AdminForgotPasswordLink, AdminForgotPasswordLinkVariables>(forgetPasswordLinkForAdmin, {
      onCompleted: (data) => {
        if (data.pretaaHealthAdminForgotPasswordLink) {
          onSuccessFormSubmit();
        }
      },
    });
  
  async function forgetPassword(email: string) {
    try {
      setForgetPasswordState({ loading: true });
      await axiosClient.post('/pretaa-health-forget-password-link',  { email });
      onSuccessFormSubmit();
    } catch (e: any ) {
      setForgetPasswordState((state) => ({ ...state, error: e?.message, loading: false }));
    }
  }


  function onSubmit(data: ForgetPasswordFormFields) {
    if (adminForgotPasswordLocation) {
      forgetPasswordForAdminHandler({
        variables: {
          email: data.email
        }
      });
      return;
    } 
    forgetPassword(getValues().email);
  }

  // reset error message which coming from the server side
  useEffect(() => {
    if (!getValues('email')) {
      setForgetPasswordState({ error: '', loading: false });
    }
  }, [getValues('email')])

  return (
    <>
      <div className="bg-gray-50 pt-6 md:pt-20 ">
        <form
          className="flex flex-col max-w-sm md:w-96 mx-auto px-5"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="font-medium text-center form-header text-gray-150 mt-6">Forgot your password?</div>
          <div
            className="font-normal form-sub-header mt-5
            text-center text-gray-150">
            Enter your registered email below to receive your password reset instructions
          </div>
          <fieldset className="flex flex-col mt-6 space-y-4 mb-10">
            <CustomInputField
              label="Email Address"
              placeholder="Enter Email Address"
              autoFocus={true}
              type="email"
              register={register('email')}
              error={Boolean(errors.email?.message)}
            />
            {errors.email?.message && (
              <ErrorMessage
                message={errors.email?.message}
                testId="email-error"
              />
            )}
            <div className="font-normal form-helper-text text-gray ">
              Remember password?
              <Link
                to={routePath}
                className="underline ml-2">
                Log In
              </Link>
            </div>
          </fieldset>
          <Button
            disabled={forgetPasswordState.loading || adminResetPasswordLoading}
            loading={forgetPasswordState.loading || adminResetPasswordLoading}
            classes={['mt-6 mb-2']}
            buttonStyle="gray">
            Reset Password
          </Button>
          {isValid && adminResetPasswordErrors && (
            <ErrorMessage message={getGraphError(adminResetPasswordErrors.graphQLErrors).join(',')} />
          )}
          {isValid && forgetPasswordState.error && <ErrorMessage message={forgetPasswordState.error} />}
        </form>
      </div>
      <div className="bg-gray-50">
        <Footer />
      </div>
    </>
  );
}
