'use client';
import Button from '@/components/buttons/Button';
import React, { useState, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/inputs/Input';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { FaPhoneAlt } from 'react-icons/fa';
import { LOGIN_MUTATION } from '@/graphql/login.mutation';
import { ILogin } from './login.interface';
import { VERIFY_LOGIN_PHONE_MUTATION } from '@/graphql/verifyPhoneLogin.mutation';
import loginSchema from './login.validation';
import { setAppData } from '@/lib/appData';
import { useAppDispatch } from '@/store/hooks';
import { getCurrentUserDetails } from '@/store/app/app.slice';
import catchError from '@/lib/catch-error';
import { PinInput } from '@mantine/core';

import { messageGenerators } from '@/config/messages';

interface ILoginType {
  // eslint-disable-next-line no-unused-vars
  setIsLoginComp: (value: boolean) => void;
  onClose: () => void;
}

const Login: React.FC<ILoginType> = ({ setIsLoginComp, onClose }) => {
  const dispatch = useAppDispatch();
  const [sendOtp, setSendOtp] = useState<boolean>(false);
  const [isVerifyOtpButtonDisabled, setIsVerifyOtpButtonDisabled] =
    useState<boolean>(true);

  const methods = useForm({
    resolver: yupResolver<ILogin>(loginSchema),
    context: { sendOtp },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [generateOtpCallBack, { loading: generateOtpLoading }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted: (d) => {
        setSendOtp(true);
        toast.success(d.customerLoginWithPhoneOtp.message);
      },
      onError: (e) => catchError(e, true),
    }
  );

  const [verifyOtpCallBack, { loading: otpLoading }] = useMutation(
    VERIFY_LOGIN_PHONE_MUTATION,
    {
      onCompleted: (d) => {
        const accessToken = d?.verifyLoginPhoneOtp.signInToken?.accessToken;
        setAppData({ token: accessToken });
        dispatch(getCurrentUserDetails());
        toast.success(messageGenerators.successMessage('Sign in'));
        onClose();
      },
      onError: (e) => catchError(e, true),
    }
  );

  const handleLogin = (formData: ILogin) => {
    if (!sendOtp) {
      generateOtpCallBack({
        variables: {
          phoneNumber: formData.phone,
        },
      });
    } else if (formData.otp) {
      verifyOtpCallBack({
        variables: {
          phoneNumber: formData.phone,
          otp: formData.otp,
        },
      });
    }
  };

  useEffect(() => {
    const otpLength = (methods.getValues('otp') as string)?.length;
    setIsVerifyOtpButtonDisabled(otpLength !== 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.getValues('otp')]);

  methods.watch('otp');
  return (
    <>
      <FormProvider {...methods}>
        <form
          className="w-full mt-3"
          onSubmit={methods.handleSubmit((data) => handleLogin(data))}
        >
          {sendOtp ? (
            <>
              <label className="block text-sm font-bold leading-6 text-gray-500 tracking-wide capitalize">
                Enter OTP here
              </label>
              <Controller
                control={methods.control}
                name="otp"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PinInput
                    length={6}
                    onChange={(newOtp) => {
                      onChange(newOtp);
                      setIsVerifyOtpButtonDisabled(newOtp.length !== 6);
                    }}
                    onBlur={onBlur}
                    value={value}
                    placeholder=""
                    inputType="tel"
                    inputMode="numeric"
                  />
                )}
              />
              <button
                onClick={() => {
                  setSendOtp(false);
                  methods.clearErrors();
                  methods.resetField('otp');
                }}
                className=" mt-3 font-extrabold text-orange-600 text-xs underline "
              >
                Edit Phone
              </button>
            </>
          ) : (
            <Input
              label="Mobile Number"
              name="phone"
              placeholder="Enter phone number here"
            >
              <FaPhoneAlt size={'25px'} color="#d2d4d3" />
            </Input>
          )}

          <Button
            loading={otpLoading || generateOtpLoading}
            disabled={
              otpLoading ||
              generateOtpLoading ||
              (sendOtp && isVerifyOtpButtonDisabled)
            }
            type="submit"
            className={`flex justify-center rounded-md ${sendOtp && isVerifyOtpButtonDisabled ? 'bg-orange-300' : 'bg-orange-500'} mt-8 p-3 w-full text-sm  tracking-wide font-semibold text-white shadow-sm`}
          >
            {sendOtp ? 'Verify OTP ' : 'Submit'}
          </Button>
        </form>
      </FormProvider>
      <div className="flex items-center gap-1 text-sm mx-auto mt-4">
        <span>Do not have account?</span>
        <button
          onClick={() => setIsLoginComp(false)}
          className="text-blue-700 underline"
        >
          Sign Up here
        </button>
      </div>
    </>
  );
};

export default Login;
