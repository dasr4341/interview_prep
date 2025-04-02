import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInputField from 'components/Input/CustomInputField';
import PassWordValidation from 'components/PassWordValidation';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { ErrorMessage, SuccessMessage } from 'components/ui/error/ErrorMessage';
import { resetPasswordMutation } from 'graphql/resetPasswordMutation.mutation';
import { ResetPassword, ResetPasswordVariables } from 'health-generatedTypes';
import messagesData from 'lib/messages';
import { passwordValidation } from 'lib/validation/password-validation';
import { setAuthToken } from 'lib/api/users';
import { useMutation } from '@apollo/client';

interface ChangePasswordFormInputs {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

interface ChangePasswordForm {
  loading: boolean;
  data?: ChangePasswordFormInputs;
  error?: string;
  successMessage?: string;
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordPage, setPasswordPage] = useState<ChangePasswordForm>({ loading: false });

  const changePasswordSchema = yup.object().shape({
    currentPassword: yup.string().required(messagesData.errorList.required).max(32, messagesData.errorList.errorMaxLength(32)),
    password: passwordValidation,
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], messagesData.errorList.matchPassword),
  });

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormInputs>({
    resolver: yupResolver(changePasswordSchema),
  });
  watch('password');

  const [changePassword] = useMutation<ResetPassword, ResetPasswordVariables>(resetPasswordMutation, {
    onCompleted: (d) => {
      reset();
      setPasswordPage({ loading: false, successMessage: messagesData.successList.passwordUpdated });
      setAuthToken({ token: String(d.pretaaHealthResetPassword.loginToken), refreshToken: String(d.pretaaHealthResetPassword.refreshToken) });
      window.location.href = '/';
    },
    onError: (e) => {
      setPasswordPage({ loading: false, error: e.message });
    }
  });

  const changePasswordSubmit = async (data: ChangePasswordFormInputs) => {
    setPasswordPage({ loading: true });
    changePassword({ 
      variables: {
        newPassword: data.password,
        oldPassword: data.currentPassword
    } });
  };

  return (
    <>
      <ContentHeader title="Change Password" className="lg:sticky"></ContentHeader>

      <ContentFrame>
        <div className="bg-gray-50 pt-6 md:pt-12 pb-4">
          <form className="space-y-5 flex flex-col mx-auto max-w-sm md:w-96 md:mx-auto px-5" onSubmit={handleSubmit(changePasswordSubmit)}>
            <h2 className="text-md sm:text-xxxl font-medium text-gray-150">Change your password</h2>
            <p className="text-base text-gray-150 font-normal">
              Enter your new password and press save. New password must be different from previous passwords. {messagesData.errorList.passwordCriteria}
            </p>
            <CustomInputField
              label="Current Password"
              placeholder='Enter Current Password'
              dataTestid="currentPassword"
              className="input placeholder-black-500 text-base"
              type={passwordShown ? 'text' : 'password'}
              register={register('currentPassword')}
              error={Boolean(errors.currentPassword?.message)}
            />
            {errors && errors.currentPassword?.message && (
              <ErrorMessage message={errors.currentPassword?.message} testId="currentPassword-error" />
            )}

            <CustomInputField
              label="New Password"
              placeholder='Enter New Password'
              className="input placeholder-black-500 text-base"
              type={passwordShown ? 'text' : 'password'}
              register={register('password')}
              error={Boolean(errors.password?.message)}
            />

            {getValues('password') && <PassWordValidation password={getValues('password')} />}
            {errors.password?.message && <ErrorMessage message={errors.password.message} />}

            <CustomInputField
              label="Confirm Password"
              placeholder='Enter Confirm Password'
              className="input placeholder-black-500 text-base"
              type={passwordShown ? 'text' : 'password'}
              register={register('passwordConfirmation')}
              error={Boolean(errors.passwordConfirmation?.message)}
            />
            {errors.passwordConfirmation?.message && <ErrorMessage message={errors.passwordConfirmation.message} />}
            <div>
              <button
                type="button"
                className="underline p-0  mb-6 text-left text-sm text-gray-600 hover:text-black"
                onClick={() => setPasswordShown(!passwordShown)}>
                {passwordShown ? 'Hide Password' : 'Show Password'}
              </button>
            </div>

            <Button text="Save" classes="w-full" testId="submit-btn" loading={passwordPage.loading} disabled={passwordPage.loading} />

            {isValid && passwordPage.error && <ErrorMessage message={passwordPage.error} />}
            {passwordPage.successMessage && <SuccessMessage message={passwordPage.successMessage} />}

            <button
              type="button"
              className="underline p-0 justify-start flex my-3 text-sm text-gray-600 hover:text-black"
              onClick={() => navigate(-1)}>
              Cancel
            </button>
          </form>
        </div>
      </ContentFrame>
    </>
  );
}
