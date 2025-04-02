import { messageGenerators } from '@/config/messages';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .required(messageGenerators.required('Phone Number'))
    .test('is-valid-phone', 'Phone number is invalid', (value) => {
      if (!value) return false;
      return value.length === 10 && /^[6-9]\d{9}$/.test(value);
    }),
  otp: Yup.string().length(6),
});

export default loginSchema;
