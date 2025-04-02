import { messageGenerators } from '@/config/messages';
import * as Yup from 'yup';

const registrationSchema = Yup.object().shape({
  fname: Yup.string()
    .required(messageGenerators.required('First Name'))
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),

  lname: Yup.string().optional(),

  phone: Yup.string()
    .required(messageGenerators.required('Phone Number'))
    .test('is-valid-phone', 'Phone number is invalid', (value) => {
      if (!value) return false;
      return value.length === 10 && /^[6-9]\d{9}$/.test(value);
    }),
  otp: Yup.string().length(6),
});

export default registrationSchema;
