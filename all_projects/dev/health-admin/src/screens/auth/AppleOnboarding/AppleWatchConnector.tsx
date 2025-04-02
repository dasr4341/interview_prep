/*  */
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { PinInput, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import messagesData from 'lib/messages';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { config } from 'config';
import Button from 'components/ui/button/Button';
import './_apple-onboarding-connect.scoped.scss';
import FitbitOTP from '../../../assets/images/fitbit-otp.png';
import { routes } from 'routes';
import {
  AppleConnectorType,
  OTPResponse,
  TabNames,
  TokenDataType,
} from './lib/apple-onboarding-interface';
import AppleOnboardingLogoutButton from './component/AppleOnboardingLogoutButton';
import { useViewportSize } from '@mantine/hooks';
import { useAppDispatch } from 'lib/store/app-store';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';

export default function AppleWatchConnector() {
  const dispatch = useAppDispatch();
  const [loadingState, setLoadingState] = useState(false);
  const [otpValidateStatus, setOtpValidateStatus] = useState<OTPResponse>();
  const [tokenData, setTokenData] = useState<TokenDataType>();
  const navigate = useNavigate();
  const [intervalStatus, setIntervalStatus] = useState<any>();
  const [validated, setValidated] = useState(false);

  const watchConnectorSchema = yup.object().shape({
    otp: yup
      .string()
      .required(messagesData.errorList.required)
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<AppleConnectorType>({
    resolver: yupResolver(watchConnectorSchema),
  });

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  headers.append('Content-Type', 'application/json');

  const { width } = useViewportSize();

  // set otp for web poll
  async function otpCallback(val: AppleConnectorType) {
    setLoadingState(true);
    try {
      const response = await fetch(
        `${config.pretaa.apiURLAppleWatch}/web-verification`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            otp: val.otp,
          }),
        }
      );
      const value = await response.json();

      if (value.errors) {
        toast.error(value?.errors?.msg, { toastId: value?.errors?.msg || 'Unable to verify token' });
        setOtpValidateStatus({ status: false, message: value?.errors?.msg });
        setLoadingState(false);
      } else if (value.status === false) {
        toast.error(value.message, { toastId: value.message });
        setOtpValidateStatus(value);
        setLoadingState(false);
      } else if (value.status) {
        const interval = setInterval(async () => {
          try {
            const res = await fetch(
              `${config.pretaa.apiURLAppleWatch}/web-poll`,
              {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                  token: value.data.token,
                }),
              }
            );
            const data = await res.json();
            setTokenData(data);
          } catch (e: any) {
            toast.error(e.message, { toastId: e.message });
            setLoadingState(false);
          }
        }, 2000);
        setIntervalStatus(interval);
      } 
    } catch (e: any) {
      toast.error(e.message, { toastId: e.message });
      setLoadingState(false);
    }
  }

  function onsubmit(val: AppleConnectorType) {
    if (getValues('otp')?.length < 6) {
      setError('otp', {
        message: 'Please enter 6 digits valid OTP',
        type: 'validate',
      });
    } else {
      clearErrors('otp');
      otpCallback({
        otp: val.otp,
      });
    }
  }

  useEffect(() => {
    if (tokenData?.status === true && !validated) {
      toast.success('Apple watch connected successfully');
      setTimeout(() => {
        navigate(routes.appleOnboarding.connect.build(TabNames.CONFIRMATION));
      }, 2000);
      setLoadingState(false);
      setValidated(true);
      clearInterval(intervalStatus);
    }
  }, [tokenData]);


  function continueReview() {
    dispatch(authSliceActions.getCurrentUser());
  }

  return (
    <section className="text-gray-700 mt-3 lg:mt-16">
      {validated && <>
        <div className="sm:flex justify-center gap-10 2xl:gap-24">
        <div className="w-32 md:w-28 lg:w-56 mx-auto sm:mx-0 md:pb-6">
          <video
              autoPlay
              loop
              muted>
              <source
                src="/video/watch-permission-allow.mp4"
                type="video/mp4"
              />
          </video>
        </div>

        <div className="border-r border-gray-200"></div>
        <div className="lg:mt-12">
          <div className="mx-auto slider-five-text-width mt-5 text-center lg:mt-0 md:text-left">
            <h2 className="text-xmd mb-3 text-black font-light leading-relaxed text-size">
              <span className="font-bold">Allow permission</span> to get apple watch data
            </h2>
          </div>
          <div className=" mt-5 lg:mt-10">
            <Button
                className="2xl:mt-5"
                type="button"
                text="Continue"
                classes="w-full"
                onClick={continueReview}
              />
          </div>
        </div>
      </div>
      </>}
      {!validated && (
        <>
          <div className="sm:flex justify-center gap-10 2xl:gap-24">
        <div className="w-32 md:w-28 lg:w-56 mx-auto sm:mx-0 md:pb-6">
          <img
            src={FitbitOTP}
            alt="fitbit_otp"
          />
        </div>

        <div className="border-r border-gray-200"></div>
        <div className="lg:mt-12">
          <div className="mx-auto slider-five-text-width mt-5 text-center lg:mt-0 md:text-left">
            <h2 className="text-xmd mb-3 text-black font-light leading-relaxed text-size">
              You will get an <span className="font-bold">OTP </span>
              in your watch
            </h2>
          </div>
          <div className=" mt-5 lg:mt-10">
            <form
              className="w-2/3 mx-auto sm:mx-0 sm:w-full pb-32 md:pb-0"
              onSubmit={handleSubmit(onsubmit)}>
              <div className="px-5 sm:px-0 pb-5 mx-auto sm:mx-0 ">
                <label className="block text-xsm font-normal text-gray-750 mb-2 text-center sm:text-left">
                  Enter OTP
                </label>
                <div className="mt-4 flex justify-center sm:justify-start">
                  <Controller
                    control={control}
                    name="otp"
                    render={({ field }) => (
                      <Group
                        position="left"
                        {...register('otp')}>
                        <PinInput
                          error={
                            otpValidateStatus?.status === false ? true : false
                          }
                          length={6}
                          inputMode="numeric"
                          inputType="number"
                          size={`${width > 640 ? 'xl' : 'md'}`}
                          autoFocus
                          placeholder=""
                          onChange={(val) => {
                            field.onChange(val);
                            setValue('otp', val);
                            trigger('otp');
                          }}
                        />
                      </Group>
                    )}
                  />
                </div>
                {errors.otp && errors.otp.message && (
                  <ErrorMessage message={String(errors?.otp.message)} />
                )}
              </div>

              <div className="md:flex justify-center pb-3 w-10/12 sm:w-full mx-auto sm:mx-0 ">
                <Button
                  className="2xl:mt-5"
                  loading={loadingState}
                  disabled={loadingState}
                  type="submit"
                  text="Validate"
                  classes="w-full"
                />
              </div>
              <AppleOnboardingLogoutButton className='px-24 -ml-1'/>
            </form>
          </div>
        </div>
      </div>
        </>
      )}
    </section>
  );
}
