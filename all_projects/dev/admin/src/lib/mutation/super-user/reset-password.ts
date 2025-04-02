import { gql } from '@apollo/client';

export const PretaaAdminResetPassword = gql`
  mutation ResetPassword($newPassword: String!, $oldPassword: String!) {
    pretaaAdminResetPassword(newPassword: $newPassword, oldPassword: $oldPassword)
  }
`;