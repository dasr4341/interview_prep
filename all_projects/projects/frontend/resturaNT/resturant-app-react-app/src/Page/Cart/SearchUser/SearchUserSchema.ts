import * as yup from 'yup';
 
export const SearchUserYupSchema = yup.object().shape({
    phone: yup
      .string()
      .matches(/^\d+$/, 'Phone number must be digits')
      .required('Phone number is required')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
  });