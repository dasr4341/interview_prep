/* eslint-disable max-len */
/*  */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import './_authFitbit-screen.scoped.scss';
import LoginHeader from 'components/LoginHeader';
import CustomInputField from 'components/Input/CustomInputField';
import catchError from 'lib/catch-error';
import { client } from 'apiClient';
import { patientOnboard } from 'graphql/onboard.mutation';
import { setAuthToken } from 'lib/api/users';
import { config } from 'config';
import messagesData from 'lib/messages';
import { PatientOnboard, PatientOnboardVariables } from 'health-generatedTypes';
import { passwordValidation } from 'lib/validation/password-validation';
import { authorizeFitbit } from 'lib/fitbit-authorize';
import { toast } from 'react-toastify';
import { HealthConnectorType } from 'interface/health-data-connector.interface';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

interface IFormInputs {
  email: string;
  password: string;
  passwordConfirmation: string;
  facility?: string;
}

const RegisterPatient = (): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const loginSchema = yup.object().shape({
    email: yup.string().required().email(),
    password: passwordValidation,
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], messagesData.errorList.matchPassword),
    facility:  yup
    .string().nullable()
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(loginSchema) as unknown as any,
  });


  async function authFitBitLogin(formInputs: IFormInputs) {
    setLoading(true);
    if (!formInputs.facility) {
      toast.error('Invalid facility id! Please contact with Facility');
      return;
    }
    try {
      const response = await client.mutate<PatientOnboard, PatientOnboardVariables>({
        mutation: patientOnboard,
        variables: {
          facilityId: formInputs.facility,
          email: formInputs.email,
          password: formInputs.password,
        },
      });
    
      if (response.data?.pretaaHealthPatientOnboard) {
        const responseData = response.data?.pretaaHealthPatientOnboard;
        sessionStorage.removeItem(config.storage.facilityId);
        setAuthToken({ token: String(responseData.loginToken), refreshToken: String(responseData.refreshToken) });

        const healthType: HealthConnectorType | null = sessionStorage.getItem(config.storage.health_data_type) as any;

        if (healthType === HealthConnectorType.apple) {
          navigate(routes.appleOnboarding.view.match, { replace: true });
        } else if (healthType === HealthConnectorType.fitbit) {
          authorizeFitbit();
        } else {
          throw new Error('Unknown Health Connector!');
        }
      }
    } catch (e: any) {
      catchError(e, true);
      console.log('Error occurred during login ...', e);
    }

    setLoading(false);
  }


  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    const facilityId = sessionStorage.getItem(config.storage.facilityId);
    if (facilityId) {
      setValue('facility', facilityId);
    }
  }, []);



  return (
    <div className="bg-gray-50 h-screen ">
      <LoginHeader className=" h-1/2 md:h-1/2" />
      <div className="bg-gray-50 pt-6 md:pt-12 pb-4 ">
        <form
          className="flex flex-col mx-auto space-y-7 max-w-sm md:w-96 md:mx-auto px-5"
          onSubmit={handleSubmit(authFitBitLogin)}>
          <div
            className="font-normal form-sub-header text-left 
          md:text-justify text-gray-150">
           Enter your new password and press continue. {messagesData.errorList.passwordCriteria}
            <br />
            <br />
            Passwords must change every 90 days.
          </div>
          <fieldset className="flex flex-col space-y-6">
            <CustomInputField
              label="Email"
              placeholder='Enter Email'
              dataTestid="email"
              autoFocus={true}
              type="email"
              register={register('email')}
              error={Boolean(errors.email?.message)}
            />
            {errors && (
              <ErrorMessage
                message={errors.email?.message ? errors.email?.message : ''}
                testId="email-error"
              />
            )}
            <>
              <CustomInputField
                label="Password"
                placeholder='Enter Password'
                dataTestid="password"
                className="input placeholder-black-500 text-base"
                type={passwordShown ? 'text' : 'password'}
                register={register('password')}
                error={Boolean(errors.password?.message)}
              />
              {errors && (
                <ErrorMessage
                  message={errors.password?.message ? errors.password?.message : ''}
                  testId="password-error"
                />
              )}

              <div className="mt-5">
                <CustomInputField
                  label="Confirm Password"
                  placeholder='Enter Confirm Password'
                  type={passwordShown ? 'text' : 'password'}
                  register={register('passwordConfirmation')}
                  error={Boolean(errors.passwordConfirmation?.message)}
                />

                {errors.passwordConfirmation && (
                  <ErrorMessage
                    message={errors.passwordConfirmation.message ? errors.passwordConfirmation.message : ''}
                  />
                )}
              </div>

              <Button
                type="button"
                buttonStyle="no-outline"
                size="xs"
                align="left"
                classes="text-more"
                onClick={togglePassword}>
                {passwordShown ? 'Hide Password' : 'Show Password'}
              </Button>
            </>
          </fieldset>

          <Button
            disabled={loading}
            loading={loading}
            testId="submit-btn">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};
export default RegisterPatient;
