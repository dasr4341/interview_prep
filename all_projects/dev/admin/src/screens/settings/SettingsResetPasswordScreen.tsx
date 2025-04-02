import React, { useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PassWordValidation from 'components/PassWordValidation';
import { useMutation } from '@apollo/client';
import { resetPassword } from 'lib/mutation/settings/ResetPassword';
import { PretaaResetPassword, PretaaResetPasswordVariables, ResetPassword, ResetPasswordVariables } from 'generatedTypes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { PretaaAdminResetPassword } from 'lib/mutation/super-user/reset-password';
import { successList, errorList } from '../../lib/message.json';
import { config } from 'config';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

interface PasswordResetFields {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required(errorList.currentPassword),
  password: yup
    .string()
    .required()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, errorList.password),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], errorList.matchPassword),
});

export default function SettingsResetPasswordScreen() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordResetFields>({
    resolver: yupResolver(passwordSchema) as unknown as any,
  });

  const [resetPasswordRequest] = useMutation<PretaaResetPassword, PretaaResetPasswordVariables>(resetPassword);
  const [resetPasswordAdmin] = useMutation<ResetPassword, ResetPasswordVariables>(PretaaAdminResetPassword);


  const [passwordShown, setPasswordShown] = useState(false);

  const onSubmit = async (formValue: PasswordResetFields) => {
    setError(null);
    try {
      const resetVariables: PretaaResetPasswordVariables = {
        newPassword: formValue.password,
        oldPassword: formValue.currentPassword,
      };
      if (location.pathname.includes('super-admin')) {
        const { data } = await resetPasswordAdmin({
          variables: resetVariables,
        });
        if (data) {
          toast.success(data?.pretaaAdminResetPassword);
        }
      } else {
        const { data } = await resetPasswordRequest({
          variables: resetVariables,
        });
        toast.success(successList.passwordUpdate);
        if (data) {
          localStorage.setItem(config.storage.token, data?.pretaaResetPassword.loginToken);
          localStorage.setItem(config.storage.refreshToken, data?.pretaaResetPassword.refreshToken);
        }
      }
      
      reset();
    } catch (e: any) {
      setError(e.message);
    }
  };

  watch('password');

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    if (!location?.pathname.includes('super-admin')) {
      TrackingApi.log({
        pageName: routes.settingsResetPassword.name,
      });
    }
  }, []);

  return (
    <>
      <ContentHeader title="Change Your Password" />
      <ContentFrame className="m-auto">
        <div className="px-6 py-6 rounded-2xl">
          <form className="flex flex-col  max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <p>
                Enter your new password and press save. New password must be different from previous passwords. Password needs to be at least 8 characters in length. Contain 1
                upper case letter (A-Z) , 1 lower case letter (a-z), Numbers (0-9) and a special character.
              </p>
            </div>
            <fieldset className="flex flex-col ">
              <input
                className={`input mb-1
                placeholder-black-500 w-full 
                ${errors ? '' : 'input-error'}`}
                placeholder="Current Password"
                type={passwordShown ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('currentPassword')}
              />
              <ErrorMessage message={errors.currentPassword?.message as string} />
              <input
                className={`input mt-5 mb-1
                  placeholder-black-500 
                  ${errors ? '' : 'input-error'}`}
                placeholder="New Password"
                type={passwordShown ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
              />
              {getValues('password') && <PassWordValidation password={getValues('password')} />}
              {errors.password && <ErrorMessage message={errors.password.message ? errors.password.message : ''} />}
              <input
                className={`input mt-5 mb-1
                placeholder-black-500  ${errors ? '' : 'input-error'}`}
                placeholder="Repeat Password"
                type={passwordShown ? 'text' : 'password'}
                {...register('passwordConfirmation')}
              />
              {errors.passwordConfirmation && <ErrorMessage message={errors.passwordConfirmation.message ? errors.passwordConfirmation.message : ''} />}
            </fieldset>
            <Button type="button" style="no-outline" size="xs" align="left" classes="my-6" onClick={togglePassword}>
              {passwordShown ? 'Hide Password' : 'Show Password'}
            </Button>
            <Button classes="my-2" type="submit">
              Save
            </Button>
            {error && <ErrorMessage message={error} />}
            <Button onClick={() => navigate(-1)} type="button" style="no-outline" size="xs" align="left" classes="my-3">
              Cancel
            </Button>
          </form>
        </div>
      </ContentFrame>
    </>
  );
}
