import messagesData from 'lib/messages';
import * as yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const phoneNoValidation = yup
  .string()
  .strict()
  .test('invalid-format', messagesData.errorList.validPhoneNumber, (value: any) => {
    if (!value) {
      return true;
    }
    return isValidPhoneNumber(value, {
      defaultCountry: 'US',
      defaultCallingCode: '+1',
    });
  });
