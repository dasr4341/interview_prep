import * as yup from 'yup';

 export const UpdatePasswordYupSchema = yup.object().shape({
    forgetPasswordAuthToken: yup.string().required(),
    newPassword: yup.string().min(4).max(10).required('Please enter new password to proceed'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Password did not match').required('Please re enter password to proceed'),
  });