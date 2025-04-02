import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FaPhoneAlt } from 'react-icons/fa';
import Input from '../inputs/Input';
import Button from '../buttons/Button';
import { useMutation } from '@apollo/client';
import { QUOTE_FORM_MUTATION } from '@/graphql/quoteForm.mutation';
import {
  QuoteFormSchemaWhenLoggedIn,
  QuoteFormSchemaWhenNotLoggedIn,
} from './quote.validation';
import {
  IQuoteFormWhenLoggedIn,
  IQuoteFormWhenNotLoggedIn,
} from './quote.interface';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CgRename } from 'react-icons/cg';
import { PinInput } from '@mantine/core';
import { VERIFY_LOGIN_PHONE_MUTATION } from '@/graphql/verifyPhoneLogin.mutation';
import { setAppData } from '@/lib/appData';
import { getCurrentUserDetails } from '@/store/app/app.slice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '500px' },
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function QuoteModal({
  carId,
  raiseQuote,
  setRaiseQuote,
}: {
  carId: string;
  raiseQuote: boolean;
  setRaiseQuote: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.app.user);
  const loggedInMethods = useForm<IQuoteFormWhenLoggedIn>({
    resolver: yupResolver(QuoteFormSchemaWhenLoggedIn),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const notLoggedInMethods = useForm<IQuoteFormWhenNotLoggedIn>({
    resolver: yupResolver(QuoteFormSchemaWhenNotLoggedIn),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { errors: loggedInErrors } = loggedInMethods.formState;
  const { errors: notLoggedInErrors } = notLoggedInMethods.formState;

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isVerifyOtpButtonDisabled, setIsVerifyOtpButtonDisabled] =
    useState<boolean>(true);

  const [quoteData, { loading: quotationLoading }] = useMutation(
    QUOTE_FORM_MUTATION,
    {
      onCompleted: (d) => {
        userData?.id ? setRaiseQuote(false) : setOtpSent(true);
        toast.success(userData?.id ? d.contactFormSubmit.message : 'OTP Sent');
      },
      onError: (e) => toast.error(e.message),
    }
  );

  const [verifyOtp, { loading: verifyOtpLoading }] = useMutation(
    VERIFY_LOGIN_PHONE_MUTATION,
    {
      onCompleted: (d) => {
        const accessToken = d?.verifyLoginPhoneOtp.signInToken?.accessToken;
        setAppData({ token: accessToken });
        dispatch(getCurrentUserDetails());
        setRaiseQuote(false);
        setOtpSent(false);
      },
      onError: (e) => toast.error(e.message),
    }
  );
  const handleFormSubmitNotLoggedIn = (data: IQuoteFormWhenNotLoggedIn) => {
    if (!otpSent) {
      quoteData({
        variables: {
          formData: {
            carId: carId,
            message: data?.message || '',
          },
          registerInput: {
            firstName: data.name?.split(' ') ? data.name?.split(' ')[0] : null,
            lastName: data.name?.split(' ') ? data.name?.split(' ')[1] : null,
            phoneNumber: data.phone,
          },
        },
      });
    } else if (data?.otp && data?.phone && otpSent) {
      verifyOtp({
        variables: {
          phoneNumber: data.phone,
          otp: data.otp,
        },
      });
    }
  };
  const handleFormSubmitLoggedIn = (data: IQuoteFormWhenLoggedIn) => {
    quoteData({
      variables: {
        formData: {
          carId: carId,
          message: data?.message || '',
        },
      },
    });
  };

  useEffect(() => {
    setIsVerifyOtpButtonDisabled(
      notLoggedInMethods.getValues('otp')?.length !== 6
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notLoggedInMethods.getValues('otp')]);

  return (
    <Modal
      open={raiseQuote}
      onClose={() => setRaiseQuote(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {!userData?.id ? (
          <FormProvider {...notLoggedInMethods}>
            <form
              className="flex flex-col gap-1"
              onSubmit={notLoggedInMethods.handleSubmit(
                handleFormSubmitNotLoggedIn
              )}
            >
              <button
                className=" self-end"
                onClick={() => setRaiseQuote(false)}
              >
                <IoMdClose
                  size={30}
                  className=" text-gray-400 p-1 bg-gray-200 rounded-full"
                />
              </button>
              <h3 className="text-gray-700 text-2xl font-semibold mb-4">
                Give your message
              </h3>
              {otpSent ? (
                <>
                  <label className="block font-bold leading-6 text-gray-500 tracking-wide capitalize mb-3">
                    Enter OTP here
                  </label>
                  <Controller
                    control={notLoggedInMethods.control}
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
                      setOtpSent(false);
                      notLoggedInMethods.resetField('otp');
                      notLoggedInMethods.clearErrors();
                    }}
                    className="self-start mt-3 font-medium text-orange-600 text-xs underline tracking-wide "
                  >
                    Edit Phone
                  </button>
                </>
              ) : (
                <>
                  <Input
                    label="Full Name"
                    name="name"
                    placeholder="Enter your name here"
                  >
                    <CgRename size={'25px'} color="#d2d4d3" />
                  </Input>
                  <Input
                    label="Phone Number"
                    name="phone"
                    placeholder="Enter your phone number here"
                  >
                    <FaPhoneAlt size={'25px'} color="#d2d4d3" />
                  </Input>
                  <div className="mt-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold leading-6 text-gray-500 tracking-wide capitalize"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      className="w-full px-3 py-2 text-gray-700 border sm:text-sm sm:leading-6 rounded-lg mt-1 focus:outline-none border-gray-400"
                      placeholder="Enter your message here"
                      {...notLoggedInMethods.register('message')}
                    />
                    {notLoggedInErrors.message && (
                      <p className="text-red-500 text-xs">
                        {notLoggedInErrors.message.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              <Button
                loading={quotationLoading || verifyOtpLoading}
                disabled={
                  quotationLoading ||
                  verifyOtpLoading ||
                  (otpSent && isVerifyOtpButtonDisabled)
                }
                type="submit"
                className={`w-full py-3 px-2 ${otpSent && isVerifyOtpButtonDisabled ? 'bg-orange-300' : 'bg-orange-500'} text-white font-bold rounded-lg transition duration-300 my-1 mt-10`}
              >
                {otpSent ? 'Verify OTP' : 'Submit'}
              </Button>
            </form>
          </FormProvider>
        ) : (
          <FormProvider {...loggedInMethods}>
            <form
              className="mt-2 flex flex-col gap-1"
              onSubmit={loggedInMethods.handleSubmit(handleFormSubmitLoggedIn)}
            >
              <button
                className=" self-end"
                onClick={() => setRaiseQuote(false)}
              >
                <IoMdClose
                  size={30}
                  className=" text-gray-400 p-1 bg-gray-200 rounded-full"
                />
              </button>
              <h3 className="text-gray-700 text-2xl font-semibold mb-4">
                Give your message
              </h3>
              <textarea
                id="message"
                rows={3}
                className="w-full px-3 py-2 text-gray-700 border sm:text-sm sm:leading-6 rounded-lg mt-1 focus:outline-none border-gray-400"
                placeholder="Enter your message here"
                {...loggedInMethods.register('message')}
              />
              {loggedInErrors.message && (
                <p className="text-red-500 text-xs">
                  {loggedInErrors.message.message}
                </p>
              )}
              <Button
                loading={quotationLoading || verifyOtpLoading}
                disabled={
                  quotationLoading ||
                  verifyOtpLoading ||
                  (otpSent && isVerifyOtpButtonDisabled)
                }
                type="submit"
                className={`w-full py-3 px-2 ${otpSent && isVerifyOtpButtonDisabled ? 'bg-orange-300' : 'bg-orange-500'} text-white font-bold rounded-lg transition duration-300 my-1 mt-10`}
              >
                {otpSent ? 'Verify OTP' : 'Submit'}
              </Button>
            </form>
          </FormProvider>
        )}
      </Box>
    </Modal>
  );
}
