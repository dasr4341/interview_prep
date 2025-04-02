import { config } from 'config';
import messagesData from 'lib/messages';
import * as yup from 'yup';

export const otpYup = yup
  .string()
  .trim()
  .matches(config.patterns.otp, messagesData.errorList.invalidOtp)
  .required(messagesData.errorList.proceedOtp)
  .min(6, messagesData.errorList.invalidOtp)
  .max(6, messagesData.errorList.invalidOtp);
