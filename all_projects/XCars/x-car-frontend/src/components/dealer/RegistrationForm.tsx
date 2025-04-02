'use client';
import React, { useEffect, useState } from 'react';
import {
  useForm,
  FormProvider,
  FieldValues,
  Controller,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registrationSchema } from './dealerRegistration.validation';
import Button from '@/components/buttons/Button';
import { messageGenerators } from '@/config/messages';
import Input from './Input';
import { useMutation } from '@apollo/client';
import { VERIFY_LOGIN_PHONE_MUTATION } from '@/graphql/verifyPhoneLogin.mutation';
import { toast } from 'react-toastify';
import {
  SEND_REGISTER_OTP,
  UPDATE_DEALER,
} from '@/graphql/updateUser.mutation';
import Image from 'next/image';
import dealerRegisterImage from '@/assets/images/dealerRegister.png';
import { RiCloseFill } from 'react-icons/ri';
import { PinInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { IoLocation } from 'react-icons/io5';

const RegistrationForm = ({
  setOpenModal,
}: {
  // eslint-disable-next-line no-unused-vars
  setOpenModal: (value: boolean) => void;
}) => {
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const {
    formState: { errors },
  } = methods;
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isVerifyOtpButtonDisabled, setIsVerifyOtpButtonDisabled] =
    useState<boolean>(true);

  const [sendOtp] = useMutation(SEND_REGISTER_OTP, {
    onCompleted: (d) => {
      toast.success(d.registerDealerWithPhoneNumberViaOtp.message);
      setIsOtpSent(true);
    },
    onError: (e) => {
      toast.error(e.message);
      setOpenModal(false);
    },
  });

  const [verifyOtp, { data: dealerData }] = useMutation(
    VERIFY_LOGIN_PHONE_MUTATION,
    {
      onCompleted: (d) => {
        setIsOtpVerified(true);
        toast.success(d.verifyLoginPhoneOtp.message);
      },
      onError: (e) => {
        toast.error(e.message);
      },
    }
  );

  const [dealerRegister, { loading }] = useMutation(UPDATE_DEALER, {
    onCompleted: () => {
      router.push('/download-app');
      toast.success(messageGenerators.successMessage('Dealer Registered'));
      setOpenModal(false);
      setIsOtpSent(false);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const handleSendOTP = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const phone = methods.getValues('phone');
      const isValid = await methods.trigger();
      if (!isValid) return;
      sendOtp({
        variables: {
          phoneNumber: phone,
        },
      });
    } catch (err) {
      methods.setError('phone', {
        type: 'manual',
        message: messageGenerators.wrongInput('Phone number'),
      });
    }
  };

  const handleVerifyOtp = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const phone = methods.getValues('phone');
    const otp = methods.getValues('otp');
    if (!otp) {
      methods.setError('otp', {
        type: 'manual',
        message: messageGenerators.required('OTP'),
      });
      return;
    }
    verifyOtp({
      variables: {
        phoneNumber: phone,
        otp: otp,
      },
    });
  };
  const handleSubmitRegistrationForm = (d: FieldValues) => {
    dealerRegister({
      variables: {
        dealerId: dealerData?.verifyLoginPhoneOtp?.dealerId,
        firstName: d.firstName,
        lastName: d.lastName,
        companyName: d.companyName,
        location: d.location,
        email: d?.email || null,
      },
    });
  };

  const handleClickEditPhone = () => {
    setIsOtpSent(false);
    setIsOtpVerified(false);
    methods.clearErrors();
    methods.resetField('otp');
  };

  useEffect(() => {
    setIsVerifyOtpButtonDisabled(
      !!errors.otp || methods.getValues('otp')?.length !== 6
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.getValues('otp'), errors.otp]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white shadow-lg w-[98%] max-w-[1200px] h-[740px] relative flex justify-center rounded-xl overflow-hidden">
        <div className="hidden md:block relative flex-1">
          <Image
            src={dealerRegisterImage}
            alt="Dealer Register Image"
            className="w-full h-full bg-cover"
          />
        </div>
        <div className="bg-white/80 w-full md:w-[50%] p-4 lg:pt-6 lg:p-12">
          <div className="flex justify-end">
            <Button onClick={() => setOpenModal(false)} className="p-0">
              <div className="bg-gray-200 p-2 rounded-full">
                <RiCloseFill size={'20px'} color="gray" />
              </div>
            </Button>
          </div>
          <div className="px-2 sm:px-4">
            <h3 className="text-3xl font-bold text-gray-800">Register</h3>
            <span className="font-light">as dealer</span>
          </div>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmitRegistrationForm)}
              className="flex flex-col gap-5 mt-4 px-2 md:px-4"
            >
              {!isOtpSent ? (
                <>
                  <Input
                    label="First Name"
                    name="firstName"
                    placeholder="Enter your first name"
                    error={errors.firstName?.message}
                  >
                    <MdDriveFileRenameOutline
                      size={'25px'}
                      color="#d2d4d3"
                      className="me-2"
                    />
                  </Input>
                  <Input
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter your last name"
                    error={errors.lastName?.message}
                  >
                    <MdDriveFileRenameOutline
                      size={'25px'}
                      color="#d2d4d3"
                      className="me-2"
                    />
                  </Input>
                  <Input
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                  >
                    <MdEmail size={'25px'} color="#d2d4d3" className="me-2" />
                  </Input>
                  <Input
                    label="Company Name"
                    name="companyName"
                    placeholder="Enter your company name"
                    error={errors.companyName?.message}
                  >
                    <MdDriveFileRenameOutline
                      size={'25px'}
                      color="#d2d4d3"
                      className="me-2"
                    />
                  </Input>
                  <Input
                    label="Location"
                    name="location"
                    placeholder="Enter your location"
                    error={errors.location?.message}
                  >
                    <IoLocation
                      size={'25px'}
                      color="#d2d4d3"
                      className="me-2"
                    />
                  </Input>
                  <Input
                    label="Phone Number"
                    name="phone"
                    placeholder="Enter your phone number"
                    error={errors.phone?.message}
                  >
                    <FaPhoneAlt
                      size={'20px'}
                      color="#d2d4d3"
                      className="me-2"
                    />
                  </Input>
                  <Button
                    disabled={isOtpSent}
                    type="button"
                    onClick={handleSendOTP}
                    className={`text-md p-2.5 mt-4 rounded-lg text-white ${isOtpSent ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#EF6E0C]'}`}
                  >
                    Proceed
                  </Button>
                </>
              ) : (
                <>
                  <label className="block text-sm font-bold leading-6 text-gray-500 tracking-wide capitalize">
                    Enter OTP here
                  </label>
                  <div className="flex gap-2 justify-between">
                    <Controller
                      control={methods.control}
                      name="otp"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <PinInput
                          disabled={isOtpVerified}
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
                    <Button
                      disabled={isOtpVerified || isVerifyOtpButtonDisabled}
                      className={`text-white p-1.5 px-3 text-sm rounded-lg ${isOtpVerified || isVerifyOtpButtonDisabled ? 'bg-orange-300' : 'bg-[#EF6E0C]'}`}
                      type="button"
                      onClick={handleVerifyOtp}
                    >
                      {isOtpVerified ? 'Verified' : 'Verify OTP'}
                    </Button>
                  </div>
                  {!isOtpVerified && (
                    <button
                      type="button"
                      onClick={handleClickEditPhone}
                      className=" mt-3 me-auto font-extrabold text-orange-600 text-xs underline "
                    >
                      Edit Phone
                    </button>
                  )}
                  <Button
                    disabled={!isOtpVerified}
                    className={`text-white p-2.5 rounded-lg ${isOtpVerified ? 'bg-[#EF6E0C]' : 'bg-orange-300'}`}
                    loading={loading}
                    type="submit"
                  >
                    Submit
                  </Button>
                </>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
