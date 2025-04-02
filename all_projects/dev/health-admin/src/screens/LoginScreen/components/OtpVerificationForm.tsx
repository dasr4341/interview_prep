import React, { useEffect, useState } from 'react';
import { VerifyOtp, VerifyOtpVariables } from 'health-generatedTypes';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { SuccessMessage, ErrorMessage } from 'components/ui/error/ErrorMessage';
import Button from 'components/ui/button/Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { client } from 'apiClient';
import { getGraphError } from 'lib/catch-error';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInputField from 'components/Input/CustomInputField';
import { getRedirectUrl, setAuthToken } from 'lib/api/users';
import { verifyOtpMutation } from 'graphql/verifyOtp.mutation';
import messagesData from 'lib/messages';
import { otpYup } from 'lib/validation/otp-yup-validation';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { useNavigate } from 'react-router-dom';
import { AppEvents } from 'interface/app.events';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
interface OtpVerificationFormFields {
  otp: string;
}
interface OtpVerificationFormInterface {
  loading: boolean;
  error?: string;
  prevScreenMessage?: string;
  data?: string;
}

export default function OtpVerificationForm({ message, twoFactorAuthToken }: { message: string; twoFactorAuthToken: string }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<OtpVerificationFormInterface>({ loading: false, prevScreenMessage: message });
  const user = useAppSelector((state) => state.auth.user);
  const actionCompleted = useAppSelector((state) => state.app.appEvents);



  const otpVerificationSchema = yup.object().shape({
    otp: otpYup
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OtpVerificationFormFields>({
    resolver: yupResolver(otpVerificationSchema),
  });

  async function verifyOtp(verificationData: OtpVerificationFormFields) {
    setCurrentState({ loading: true });
    try {
      const response = await client.mutate<VerifyOtp, VerifyOtpVariables>({
        mutation: verifyOtpMutation,
        variables: {
          otp: Number(verificationData.otp),
          twoFactorAuthToken,
        },
      });
      if (response.errors) {
        setCurrentState({ loading: false, error: getGraphError(response.errors).join(',') });
      } else if (response?.data?.pretaaHealthVerifyTwoFactorAuthentication) {
        setCurrentState({ loading: false, data: messagesData.successList.login });
        const loginTokens = response.data.pretaaHealthVerifyTwoFactorAuthentication;

        setAuthToken({ token: String(loginTokens.loginToken), refreshToken: String(loginTokens.refreshToken) });
        dispatch(authSliceActions.getCurrentUser());
      }
    } catch (e: any) {
      setCurrentState({ loading: false, error: e.message });
    }
  }

  useEffect(() => {
    if (user && actionCompleted === AppEvents.LOGIN_SUCCESSFUL) {
      const url = getRedirectUrl(user);
      dispatch(appSliceActions.setAppEvents(null));
      navigate(url);
    }
    // 
  }, [user?.pretaaHealthCurrentUser.id, actionCompleted]);

  return (
    <form
      className="flex flex-col mx-auto space-y-7 max-w-sm md:w-96 md:mx-auto px-5"
      onSubmit={handleSubmit(verifyOtp)}
      onChange={() => setCurrentState({ loading: false })}>
      <fieldset className="flex flex-col space-y-6">
        <CustomInputField
          label="Please enter the OTP"
          placeholder='Enter The OTP'
          autoFocus={true}
          register={register('otp')}
          error={Boolean(errors.otp?.message)}
        />
        {errors.otp?.message && <ErrorMessage message={errors.otp?.message} />}
      </fieldset>
      <Button
        disabled={currentState.loading}
        loading={currentState.loading}
        testId="submit-btn">
        Verify OTP
      </Button>
      {isValid && currentState.error && <ErrorMessage message={currentState.error} />}
      {isValid && currentState.data && <SuccessMessage message={currentState.data} />}
      {currentState.prevScreenMessage && <SuccessMessage message={currentState.prevScreenMessage} />}
    </form>
  );
}
