'use client';
import Button from '@/components/buttons/Button';
import React, { useState, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/inputs/Input';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { REGISTER_MUTATION } from '@/graphql/register.mutation';
import { VERIFY_LOGIN_PHONE_MUTATION } from '@/graphql/verifyPhoneLogin.mutation';
import registrationSchema from './registration.validation';
import { IRegistrationInterface } from './registration.interface';
import { PinInput } from '@mantine/core';
import { setAppData } from '@/lib/appData';
import { useAppDispatch } from '@/store/hooks';
import { getCurrentUserDetails } from '@/store/app/app.slice';
import { messageGenerators } from '@/config/messages';

interface IRegisterType {
  // eslint-disable-next-line no-unused-vars
  setIsLoginComp: (value: boolean) => void;
  onClose: () => void;
}

const Register: React.FC<IRegisterType> = ({ setIsLoginComp, onClose }) => {
  const dispatch = useAppDispatch();
  const [sendOtp, setSendOtp] = useState(false);
  const methods = useForm<IRegistrationInterface>({
    resolver: yupResolver(registrationSchema),
  });
  const [isVerifyOtpButtonDisabled, setIsVerifyOtpButtonDisabled] =
    useState<boolean>(true);

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted: (d) => {
      setSendOtp(true);
      toast.success(d.registerUser.message);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const [verifyOtp, { loading: otpLoading }] = useMutation(
    VERIFY_LOGIN_PHONE_MUTATION,
    {
      onCompleted: (d) => {
        const accessToken = d?.verifyLoginPhoneOtp.signInToken?.accessToken;
        setAppData({ token: accessToken });
        dispatch(getCurrentUserDetails());
        toast.success(messageGenerators.successMessage('Register'));
        onClose();
      },
      onError: (e) => toast.error(e.message),
    }
  );

  const handleSubmit = (formData: IRegistrationInterface) => {
    if (!sendOtp) {
      register({
        variables: {
          phoneNumber: formData.phone,
          firstName: formData.fname,
          lastName: formData.lname,
        },
      });
    } else {
      if (formData.otp) {
        verifyOtp({
          variables: {
            phoneNumber: formData.phone,
            otp: formData.otp,
          },
        });
      }
    }
  };

  useEffect(() => {
    const otpLength = (methods.getValues('otp') as string)?.length;
    setIsVerifyOtpButtonDisabled(otpLength !== 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.getValues('otp')]);

  return (
    <>
      <FormProvider {...methods}>
        <form
          className=" mt-3 w-full"
          onSubmit={methods.handleSubmit((data) => handleSubmit(data))}
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
            <>
              <Input label="First Name" name="fname" placeholder="John">
                <MdDriveFileRenameOutline size={'25px'} color="#d2d4d3" />
              </Input>
              <Input label="Last Name" name="lname" placeholder="Doe">
                <MdDriveFileRenameOutline size={'25px'} color="#d2d4d3" />
              </Input>
              <Input
                label="Phone Number"
                name="phone"
                placeholder="Enter phone number here"
              >
                <FaPhoneAlt size={'25px'} color="#d2d4d3" />
              </Input>
            </>
          )}
          <div>
            <Button
              loading={otpLoading}
              disabled={otpLoading || (sendOtp && isVerifyOtpButtonDisabled)}
              type="submit"
              className={`flex justify-center rounded-md ${sendOtp && isVerifyOtpButtonDisabled ? 'bg-orange-300' : 'bg-orange-500'} mt-8 p-3 w-full text-sm  tracking-wide font-semibold text-white shadow-sm`}
            >
              {sendOtp ? 'Verify OTP ' : 'Submit'}
            </Button>
          </div>
        </form>
      </FormProvider>

      <div className="flex items-center gap-1 text-sm mx-auto mt-4">
        <span>Already registered?</span>
        <button
          onClick={() => setIsLoginComp(true)}
          className="text-blue-700 underline"
        >
          Login here
        </button>
      </div>
    </>
  );
};

export default Register;
