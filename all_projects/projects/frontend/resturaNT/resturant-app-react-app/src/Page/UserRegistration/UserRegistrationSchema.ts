import * as yup from 'yup';

  const UserSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email().required('Email is required'),
    phone: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    address: yup
      .string()
      .min(4, 'Address must be at least 4 characters')
      .max(40, 'Address must be at most 40 characters')
      .required('Address is required'),
    password: yup
      .string()
      .min(4, 'Password must be at least 4 characters')
      .max(40, 'Password must be at most 40 characters')
      .required('Password is required'),
  });
export default UserSchema;