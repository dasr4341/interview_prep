/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import LoginHeader from 'components/LoginHeader';
import PassWordValidation from 'components/PassWordValidation';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import catchError from 'lib/catch-error';
import restApi from 'lib/rest-client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'routes';
import * as yup from 'yup';
import { errorList } from '../../../lib/message.json';

interface PasswordResetFields {
  password: string;
  passwordConfirmation: string;
}

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, errorList.password),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], errorList.matchPassword),
});

export default function PasswordResetScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, welcomeToken }: { token?: string; welcomeToken?: string } = useParams();
  const [passwordShown, setPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PasswordResetFields>({
    resolver: yupResolver(passwordSchema) as unknown as any,
  });

  const [isBlur, setIsBlur] = useState(false);

  const onSubmit = async (formData: PasswordResetFields) => {
    try {
      if (location?.pathname.includes('super-admin')) {
        await restApi.adminForgetPassword({
          forgotPwToken: welcomeToken ? welcomeToken : String(token),
          newPassword: formData.password,
        });
      } else {
        await restApi.forgetPassword({
          forgotPwToken: welcomeToken ? welcomeToken : String(token),
          newPassword: formData.password,
        });
      }
      toast.success('Password is successfully reset');
      navigate(location?.pathname.includes('super-admin') ? routes.superUserLogin.match : routes.login.match);
    } catch (e: any) {
      catchError(e, true);
      toast.error(e.message);
    }
  };

  watch('password');

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };


  return (
    <div className="bg-gray-50 h-screen">
      <LoginHeader />
      <ContentFrame>
        <div
          className="pt-10 pb-6 xl:pt-28 md:w-96
          md:mx-auto px-5">
          {welcomeToken && <h3 className="text-md xl:text-lg text-gray-150 mb-3">Set your new password</h3>}

          {token && <h3 className="text-md xl:text-lg text-gray-150 mb-3">Password reset</h3>}

          <p className="text-base text-gray-150 mb-5">
            Enter your new password and press save. New password must be different from previous passwords. Password
            needs to be at least 8 characters in length. Contain 1 upper case letter (A-Z) , 1 lower case letter (a-z),
            Numbers (0-9) and a special character.
          </p>
          <form className="flex flex-col space-y-4 max-w-sm pt-3" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="flex flex-col relative">
              {getValues('password') && (
                <label
                  htmlFor=""
                  className="text-xs text-gray-800 mb-2 
              bg-gray-50 absolute -top-3 left-3 px-2">
                  New Password
                </label>
              )}
              <input
                className={`input 
                placeholder-black-500 text-base bg-gray-50
                ${errors ? '' : 'input-error'}`}
                placeholder="New Password"
                type={passwordShown ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
                onBlur={() => setIsBlur(true)}
              />
              {isBlur && <PassWordValidation password={getValues('password')} />}

              {errors.password && <ErrorMessage message={errors.password.message ? errors.password.message : ''} />}
              <input
                className={`input
                ${!isBlur ? 'mt-6' : ''}
                placeholder-black-500 text-base bg-gray-50
                ${errors?.passwordConfirmation ? 'input-error' : ''}`}
                placeholder="Repeat Password"
                type={passwordShown ? 'text' : 'password'}
                {...register('passwordConfirmation')}
              />
              {errors.passwordConfirmation && <ErrorMessage message={errors.passwordConfirmation.message ? errors.passwordConfirmation.message : ''} />}
            </fieldset>
            <Button type="button" style="no-outline" size="xs" align="left" classes="my-3" onClick={togglePassword}>
              {passwordShown ? 'Hide Password' : 'Show Password'}
            </Button>
            <Button type="submit">Save</Button>
          </form>
        </div>
      </ContentFrame>
    </div>
  );
}
