import { messageGenerators } from '@/config/messages';
import * as Yup from 'yup';

export const registrationSchema = Yup.object({
  firstName: Yup.string().required(messageGenerators.required('First Name')),
  lastName: Yup.string().required(messageGenerators.required('Last Name')),
  email: Yup.string().required(messageGenerators.required('Email')),
  phone: Yup.string()
    .required(messageGenerators.required('Phone Number'))
    .test('is-valid-phone', 'Phone number is invalid', (value) => {
      if (!value) return false;
      return value.length === 10 && /^[6-9]\d{9}$/.test(value);
    }),
  companyName: Yup.string().required(
    messageGenerators.required('Company Name')
  ),
  location: Yup.string().required(messageGenerators.required('Location')),

  otp: Yup.string().length(6, 'OTP must be 6 digits'),
});
