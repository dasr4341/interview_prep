import React, { useEffect, useState } from 'react';
import { Switch } from '@mantine/core';
import { Link } from 'react-router-dom';
import CustomInputField from 'components/Input/CustomInputField';
import Button from 'components/ui/button/Button';
import { ContentHeader } from 'components/ContentHeader';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'lib/store/app-store';
import { client } from 'apiClient';
import { sendOtpStepOneMutation } from 'graphql/sendOtpStepOne.mutation';
import { SendOtpStepTwoMutation } from 'graphql/sendOtpStepTwo.mutation';
import { SendOtpStepOne, SendOtpStepTwo, SendOtpStepTwoVariables } from 'health-generatedTypes';
import catchError, { getGraphError } from 'lib/catch-error';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ErrorMessage, SuccessMessage } from 'components/ui/error/ErrorMessage';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { otpYup } from 'lib/validation/otp-yup-validation';

interface TwoFactorAuthenticationInterface {
  loading: boolean;
  error?: string | null;
  data?: string | null;
}
interface OtpValidationInterface {
  otp: string;
}
interface ToggleHelperInterface {
  twoFactorAuthentication: boolean;
  toggleState: boolean;
}

export default function TwoFactorAuthentication() {
  const userData = useAppSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [toggleHelper, setToggleHelper] = useState<ToggleHelperInterface>({
    twoFactorAuthentication: Boolean(userData?.pretaaHealthCurrentUser.twoFactorAuthentication),
    toggleState: false,
  });
  const [currentState, setCurrentState] = useState<TwoFactorAuthenticationInterface>({ loading: false });
  const [checkAuth, setCheckAuth] = useState<boolean>(false);

  const schema = yup.object().shape({
    otp: otpYup
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<OtpValidationInterface>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  
  async function sendOtp(name: string) {
    if (!checkAuth && name !== 'resend') {
      setToggleHelper({ twoFactorAuthentication: !toggleHelper.twoFactorAuthentication, toggleState: true });
    } else if (checkAuth && name !== 'resend') {
      setToggleHelper({ twoFactorAuthentication: !toggleHelper.twoFactorAuthentication, toggleState: true });
    } else {
      setToggleHelper({ twoFactorAuthentication: toggleHelper.twoFactorAuthentication, toggleState: true });
    }

    setCurrentState({ loading: true });
    try {
      const response = await client.mutate<SendOtpStepOne>({
        mutation: sendOtpStepOneMutation,
      });
      if (response.data?.pretaaHealthTwoFactorAuthenticationotp) {
        setCurrentState({ loading: false, data: response.data.pretaaHealthTwoFactorAuthenticationotp });
      }
    } catch (e: any) {
      setCurrentState({ loading: false, error: catchError(e) });
    }
  }

  async function validateOtp(otp: OtpValidationInterface) {
    setCurrentState({ loading: true });
    try {
      const response = await client.mutate<SendOtpStepTwo, SendOtpStepTwoVariables>({
        mutation: SendOtpStepTwoMutation,
        variables: { otp: Number(otp.otp) },
      });
      if (response.errors) {
        setCurrentState({ loading: false, error: getGraphError(response.errors).join(',') });
      } else if (response.data?.pretaaHealthTwoFactorAuthentication) {
        dispatch(authSliceActions.getCurrentUser());
        setCurrentState({
          loading: false,
          data:
            response.data.pretaaHealthTwoFactorAuthentication.twoFactorAuthentication
            ? 'Two Factor Authentication enabled successfully'
            : 'Two Factor Authentication disabled successfully'
        });
        setToggleHelper({
          ...toggleHelper,
          toggleState: false,
        });
        setValue('otp', '');
        dispatch(authSliceActions.getCurrentUser());
        setCheckAuth(true);
      }
    } catch (e: any) {
      setCurrentState({ loading: false, error: e.message });
    }
  }

  useEffect(() => {
    if (userData?.pretaaHealthCurrentUser.twoFactorAuthentication) {
      setToggleHelper({ ...toggleHelper, twoFactorAuthentication: userData?.pretaaHealthCurrentUser.twoFactorAuthentication });
    }
    // 
  }, []);

  return (
    <>
      <ContentHeader
        title="Two-Factor Authentication"
        className="lg:sticky"
        disableGoBack={false}></ContentHeader>
      <div className="pt-6 md:pt-12 pb-4">
        <div className="flex flex-col mx-auto space-y-7 max-w-3xl md:w-1/3 md:mx-auto px-5">
          <div className="flex justify-between border-b pb-5">
            <h2 className="text-pt-primary font-bold text-base">Two-Factor Authentication</h2>
            <div className="twoFactorAuthSwitch">
              <Switch
                checked={toggleHelper.twoFactorAuthentication}
                disabled={toggleHelper.toggleState}
                onChange={() => sendOtp('toggle')}
                size="lg"
                color="teal"
              />
            </div>
          </div>
          <p className="text-gray-150 font-normal text-sm italic">
            Two-Factor Authentication is currently
            <span className="text-gray-150 px-1">
              {userData?.pretaaHealthCurrentUser.twoFactorAuthentication ? 'enabled' : 'disabled'}
            </span>
            for your account
          </p>

          <div className="text-black font-normal text-base">
            <p className="pb-4">
              Two-Factor Authentication adds an extra layer of security to protect your account from unauthorized
              access.
            </p>

            <p className="pb-4">
              When you turn on Two-Factor Authentication, we will first confirm your identity by sending a One Time
              Passcode (OTP) to your registered email address. You will copy this OTP into this page.
            </p>

            <p className="pb-4">
              Afterwards this confirmation, Two-Factor Authentication is turned on. And, when you log into Pretaa, we
              will ask for your password and then email an OTP to your registered email address. You will need to enter
              this OTP into Pretaa to complete your login.
            </p>

            <p className="pb-4">
              You can disable Two-Factor Authentication any time you want simply by returning to this screen and
              toggling it off. Before we disable Two-Factor Authentication, we will confirm your identity by sending you
              an email to your registered address containing an OTP. You will enter this OTP into this page.
            </p>
          </div>

          {toggleHelper.toggleState && (
            <div className="text-gray-150 font-normal text-more">
              <p className="pb-4">
                To confirm your identity, we have emailed an OTP to{' '}
                {userData?.pretaaHealthCurrentUser.email && (
                  <span className="text-gray-150">{userData?.pretaaHealthCurrentUser.email}</span>
                )}
                .
              </p>
              <p className="pb-4">Please enter the OTP below and submit</p>
              <form
                onSubmit={handleSubmit(validateOtp)}
                onChange={() => setCurrentState({ ...currentState, error: null })}>
                <CustomInputField
                  register={register('otp')}
                  dataTestid="otp"
                  label="Enter the OTP"
                  placeholder="Enter the OTP"
                  className="input placeholder-gray-150 text-more"
                  error={false}
                  autoFocus={true}
                />
                {errors.otp?.message && <ErrorMessage message={errors.otp?.message} />}
                <Button
                  type="submit"
                  classes="w-full mt-6 mb-6"
                  disabled={currentState.loading}
                  loading={currentState.loading}>
                  Submit
                </Button>
              </form>
            </div>
          )}
          {isValid && currentState.error && <ErrorMessage message={currentState.error} />}
          {currentState?.data && <SuccessMessage message={currentState?.data} />}
        </div>
      </div>

      <div className="border-t pb-10">
        {toggleHelper.toggleState ? (
          <div className="flex flex-col mx-auto space-y-2 max-w-3xl md:w-1/3 md:mx-auto px-5">
            <p className="text-gray-150 font-normal text-more pt-6 pb-3">Didn’t receive the OTP?</p>
            <div
              className="text-gray-150 font-normal text-sm pb-6 mt-0 underline cursor-pointer"
              onClick={() => sendOtp('resend')}>
              Resend
            </div>
          </div>
        ) : (
          <div className="flex flex-col mx-auto space-y-7 max-w-3xl md:w-1/3 md:mx-auto px-5">
            <Link
              to={'/dashboard/settings/profile/non-sso'}
              className="text-gray-150 font-normal text-sm py-6 underline">
              Cancel
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
