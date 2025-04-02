import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Full Name must be at least 2 characters long')
    .max(50, 'Full Name cannot exceed 50 characters')
    .required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default RegisterSchema;
