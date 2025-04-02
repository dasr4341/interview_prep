import { config } from 'config';
import messagesData from 'lib/messages';
import * as yup from 'yup';

export const passwordValidation = yup
  .string()
  .trim()
  .required(messagesData.errorList.required)
  .min(8, messagesData.errorList.password)
  .max(32, messagesData.errorList.errorMaxLength(config.form.passwordMaxLength))  
  .matches(config.patterns.password, messagesData.errorList.password);

  export const passwordValidationLogin = yup
    .string()
    .trim()
    .required(messagesData.errorList.required)
    .min(8, messagesData.errorList.invalidPassword)
    .max(32, messagesData.errorList.invalidPassword)
    .matches(config.patterns.password, messagesData.errorList.invalidPassword);