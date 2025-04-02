import * as yup from 'yup';

const ResetPasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(4, 'Minimum length of password must be 4 characters' )
    .max(10, 'Maximum length of password must be at most 4 characters')
    .required('Please enter your old password'),
  newPassword: yup
    .string()
  .min(4, 'Minimum length of password must be 4 characters' )
    .max(10, 'Maximum length of password must be at most 4 characters')
    .required('Please enter a new password'),
  reEnterPassword: yup
    .mixed()
    .notOneOf([yup.ref('oldPassword')], 'Old and new  password must be different')
    .oneOf([yup.ref('newPassword'), null], 'Password not matched')
    .required('Please re enter your new password'),
});

export default ResetPasswordSchema;

