import { message } from '@/config/message';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(message.required('email address')),
  password: Yup.string()
    .required(message.required('password'))
    .min(8, 'Password must be at least 8 characters long'),
});

export default loginSchema;
