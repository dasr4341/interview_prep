import { gql } from '@apollo/client';

export const resetPassword = gql`
  mutation PretaaResetPassword($newPassword: String!, $oldPassword: String!) {
    pretaaResetPassword(newPassword: $newPassword, oldPassword: $oldPassword)
  }
`;
