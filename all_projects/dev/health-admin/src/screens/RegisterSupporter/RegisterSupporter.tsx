import LoginHeader from 'components/LoginHeader';
import CustomInputField from 'components/Input/CustomInputField';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from 'components/ui/button/Button';
import { ErrorMessage, SuccessMessage } from 'components/ui/error/ErrorMessage';
import messagesData from 'lib/messages';
import { config } from 'config';
import { SpaceOnly } from 'lib/form-validation/space-only';
import PassWordValidation from 'components/PassWordValidation';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SupporterAcceptInvitationMutation } from 'graphql/supporterAcceptInvitation.mutation';
import { SupporterAcceptInvitationVariables, SupporterAcceptInvitation, CheckSupporterExpiredLink, CheckSupporterExpiredLinkVariables } from 'health-generatedTypes';
import catchError, { getGraphError } from 'lib/catch-error';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { toast } from 'react-toastify';
import { passwordValidation } from 'lib/validation/password-validation';
import { CheckSupporterExpiredPassword } from 'graphql/checkSupporterExpiredPassword.query';

interface LoginFormFields {
  firstName: string;
  lastName: string;
  newPassword: string;
  confirmPassword: string;
}

const loginSchema = yup.object().shape({
  firstName: yup
    .string()
    .required(messagesData.errorList.required)
    .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength))
    .transform(SpaceOnly)
    .typeError(messagesData.errorList.required),
  lastName: yup
    .string()
    .required(messagesData.errorList.required)
    .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength))
    .transform(SpaceOnly)
    .typeError(messagesData.errorList.required),
  newPassword: passwordValidation,
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], messagesData.errorList.matchPassword),
});

export default function RegisterSupporter() {
  const { token } = useParams();
  const [showPasswordState, setShowPasswordState] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormFields>({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });

  watch('newPassword');

  const [checkLinkExpire] = useLazyQuery<
  CheckSupporterExpiredLink,
  CheckSupporterExpiredLinkVariables
  >(CheckSupporterExpiredPassword, { 
    onError: (e) => {
      catchError(e, true);
      navigate(routes.login.match);
    }
  });

  const [
    acceptInvitationCallBack,
    { loading: acceptInvitationLoading, data: acceptInvitationData, error: acceptInvitationError, reset: acceptInvitationReset },
  ] = useMutation<SupporterAcceptInvitation, SupporterAcceptInvitationVariables>(SupporterAcceptInvitationMutation, {
    onCompleted: () => { 
      navigate(routes.logout.match);
      toast.success('Successfully registered!');
    },
    onError: (e) => console.log(getGraphError(e.graphQLErrors).join(',')),
  });

  function onSubmit(loginCredentials: LoginFormFields) {
    acceptInvitationCallBack({
      variables: {
        invitationToken: String(token),
        supporterFirstName: loginCredentials.firstName,
        supporterLastName: loginCredentials.lastName,
        supporterPassword: loginCredentials.newPassword,
      },
    });
  }

  useEffect(() => {
    checkLinkExpire({
      variables: {
        invitationToken: String(token)
      }
    });
  // 
  }, []);

  return (
    <div className=" h-custom">
      <LoginHeader className=" h-1/2 md:h-1/2" />
      <div className="py-12 ">
        <form
          className="flex flex-col mx-auto space-y-7 max-w-sm md:w-96 px-5 w-4/5"
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => acceptInvitationError && acceptInvitationReset()}>
          <div className=" font-normal text-base text-gray-150 ">
            You’ve been invited in Pretaa Health. Please enter your information to continue with signup.
          </div>
          <fieldset className="flex flex-col space-y-6 items-start">
            <CustomInputField
              label="First Name"
              placeholder={'Enter First Name'}
              dataTestid="firstName"
              autoFocus={true}
              type="text"
              register={register('firstName')}
              error={Boolean(errors.firstName?.message)}
            />
            {errors.firstName?.message && <ErrorMessage message={errors.firstName?.message} testId="name-error" />}

            <CustomInputField
              label="Last Name"
              placeholder={'Enter Last Name'}
              dataTestid="lastName"
              type="text"
              register={register('lastName')}
              error={Boolean(errors.lastName?.message)}
            />
            {errors.lastName?.message && <ErrorMessage message={errors.lastName?.message} testId="name-error" />}

            <div className="w-full">
              <CustomInputField
                label="New Password"
                placeholder={'Enter New Password'}
                data-testid="newPassword"
                className="input placeholder-black-500 text-base"
                type={showPasswordState ? 'text' : 'password'}
                register={register('newPassword')}
                error={Boolean(errors.newPassword?.message)}
              />
              {errors.newPassword?.message && <ErrorMessage message={errors.newPassword?.message} />}
              <div className="w-full">
                {' '}
                {getValues('newPassword') && getValues('newPassword').length > 0 && (
                  <PassWordValidation password={getValues('newPassword')} />
                )}
              </div>
            </div>

            <CustomInputField
              label="Confirm Password"
              placeholder={'Enter Confirm Password'}
              data-testid="confirmPassword"
              className="input placeholder-black-500 text-base"
              type={showPasswordState ? 'text' : 'password'}
              register={register('confirmPassword')}
              error={Boolean(errors.confirmPassword?.message)}
            />
            {errors.confirmPassword?.message && <ErrorMessage message={errors.confirmPassword?.message} />}
            <button
              className=" text-sm font-normal text-gray-800 underline text-left"
              type="button"
              onClick={() => setShowPasswordState(!showPasswordState)}>
              Show Password
            </button>

            <div className=" text-sm font-normal text-gray-150">
              By clicking ‘Register’ you agree to Pretaa’s{' '}
              <a className='link text-blue' href="https://pretaa.com/terms/" target="_blank" rel="noreferrer">
                Terms
              </a>{' '}
              and{' '}
              <a className='link text-blue' href="https://pretaa.com/privacy-policy/" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              .
            </div>
          </fieldset>
          <Button disabled={acceptInvitationLoading} loading={acceptInvitationLoading}>
            Register
          </Button>

          {isValid && acceptInvitationError && (
            <ErrorMessage message={getGraphError(acceptInvitationError.graphQLErrors).join(',')} />
          )}
          {isValid && acceptInvitationData && <SuccessMessage message={messagesData.successList.supporterRegistered} />}
        </form>
      </div>
    </div>
  );
}
