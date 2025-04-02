import { messageGenerators } from '@/config/messages';
import * as yup from 'yup';

export const QuoteFormSchemaWhenLoggedIn = yup.object().shape({
  message: yup.string().required(messageGenerators.required('Message')),
});

export const QuoteFormSchemaWhenNotLoggedIn = yup.object().shape({
  name: yup.string(),
  phone: yup
    .string()
    .required(messageGenerators.required('Phone Number'))
    .test('is-valid-phone', 'Phone number is invalid', (value) => {
      if (!value) return false;
      return value.length === 10 && /^[6-9]\d{9}$/.test(value);
    }),
  otp: yup.string().length(6),
  message: yup.string(),
});
