import { message } from '@/config/message';
import * as Yup from 'yup';

const emailSchama = Yup.object().shape({
  email: Yup.string()
    .email(message.required('Email Address'))
    .required('Email is required'),
});

export default emailSchama;
