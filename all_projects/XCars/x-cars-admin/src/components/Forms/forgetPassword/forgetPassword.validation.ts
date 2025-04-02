import { message } from '@/config/message';
import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  password: Yup.string().required(message.required('password')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required(message.required('password')),
});

export default forgotPasswordSchema;
