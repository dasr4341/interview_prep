import messagesData from 'lib/messages';
import * as yup from 'yup';

export const yupEmailValidation = yup
  .string()
  .trim()
  .required(messagesData.errorList.required)
  .strict()
  .email(messagesData.errorList.email);
