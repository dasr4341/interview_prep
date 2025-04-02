/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { ContentFrame } from '../../components/content-frame/ContentFrame';
import { useMutation } from '@apollo/client';
import { TwoFactorAuthenticationOTP, TwoFactorAuthentication } from '../../lib/mutation/auth/two-step-auth';
import { toast } from 'react-toastify';
import {
  PretaaTwoFactorAuthentication,
  PretaaTwoFactorAuthenticationOTP,
  PretaaTwoFactorAuthenticationVariables,
} from '../../generatedTypes';
import catchError from '../../lib/catch-error';
import Button from 'components/ui/button/Button';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch';
import { routes } from '../../routes';
import LoginHeader from '../../components/LoginHeader';
import { errorList } from '../../lib/message.json';
import '../../scss/modules/_two-factor-auth.scss';
import { RootState } from 'lib/store/app-store';
import { useDispatch, useSelector } from 'react-redux';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';

export default function SettingsTwoStepAuth(): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [optError, setOtpError] = useState(false);
  const [twoStepAuth, setTwoStepAuth] = useState(user?.twoFactorAuthentication || false);
  const [otp, setOpt] = useState('');
  const [sendTwoFactorAuthCode] = useMutation<PretaaTwoFactorAuthenticationOTP>(TwoFactorAuthenticationOTP);
  const [verifyOtp, { loading }] = useMutation<PretaaTwoFactorAuthentication, PretaaTwoFactorAuthenticationVariables>(
    TwoFactorAuthentication
  );
  const dispatch = useDispatch();


  const toggleTwoStepAuth = async () => {
    if (!otp) {
      setOtpError(true);
      return;
    }
    try {
      const { data } = await verifyOtp({
        variables: {
          otp: parseFloat(otp),
        },
      });
      if (data) {
        dispatch(authSliceActions.getCurrentUser());
        navigate(`${routes.settingsProfile.match}?authenticateLabel=true`);
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  const otpSend = async (resend?: boolean) => {
    try {
      const data = await sendTwoFactorAuthCode();
      if (data?.data?.pretaaTwoFactorAuthenticationotp) {
        toast.success(data?.data?.pretaaTwoFactorAuthenticationotp);
      }
      if (!resend) {
        setTwoStepAuth(!twoStepAuth);
        setShow(true);
      }
    } catch (e) {
      catchError(e, true);
      setTwoStepAuth(user?.twoFactorAuthentication || false);
      setShow(false);
    }
  };

  const handleChange = (value: string) => {
    if (optError) {
      setOtpError(false);
    }
    const inputValue = value.replace(/[^0-9]/g, '');
    setOpt(inputValue);
  };

  return (
    <>
      <LoginHeader className='two-step-auth-header'/>
      <ContentFrame className="m-auto two-step-auth">
        <div className="max-w-md m-auto">
          <div className="flex justify-between border-b pb-4 item-center mb-31">
            <div className="text-primary font-semibold two-factor-auth-text">Two-Factor Authentication</div>
            <ToggleSwitch checked={twoStepAuth} onChange={() => otpSend(false)} />
          </div>
          {!user?.twoFactorAuthentication && !twoStepAuth  && (
            <div className="two-factor-auth-disable italic caret-gray-150 mt-2 mb-5">
              Two-Factor Authentication is currently disabled for your account
            </div>
          )}
          <div className="space-y-8 description">
            <div>
              Two-Factor Authentication adds an extra layer of security to protect your account from unauthorized
              access.
            </div>
            <div>
              When you turn on Two-Factor Authentication, we will first confirm your identity by sending a One Time
              Passcode (OTP) to your registered email address. You will copy this OTP into this page.
            </div>
            <div>
              Afterwards this confirmation, Two-Factor Authentication is turned on. And, when you log into Pretaa, we
              will ask for your password and then email an OTP to your registered email address. You will need to enter
              this OTP into Pretaa to complete your login.
            </div>
            <div>
              You can disable Two-Factor Authentication any time you want simply by returning to this screen and
              toggling it off. Before we disable Two-Factor Authentication, we will confirm your identity by sending you
              an email to your registered address containing an OTP. You will enter this OTP into this page.
            </div>
          </div>
          {show && (
            <>
              <div className="otp-description">
                <div>To confirm your identity, we have emailed a One Time Passcode to {user.email}.</div>
                <div className="mt-5">Please enter the One Time Passcode below and submit</div>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  className="input w-full mt-37"
                  id="url"
                  value={otp}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="One Time Passcode"
                  maxLength={6}
                />
                {optError && <ErrorMessage message={errorList.otp}/>}
                <Button onClick={toggleTwoStepAuth} classes="mt-3 w-full mt-37" loading={loading}>
                  Submit
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="mt-37 border-b mb-5" />
        {!show ? (
          <p className="underline font-medium text-sm cursor-pointer text-gray-150 mb-45"
             onClick={() => navigate(-1)}>Cancel</p>
        ) : (
          <>
            <p className="font-medium text-sm text-gray-150">Didn’t receive the link?</p>
            <p className="underline font-medium text-sm cursor-pointer text-gray-150 mt-2 mb-41"
               onClick={() => otpSend(true)}>Resend</p>
          </>
        )}
      </ContentFrame>
    </>
  );
}
