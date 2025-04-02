import * as yup from 'yup';

export const ForgetPasswordYupSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Please enter email to proceed'),
});