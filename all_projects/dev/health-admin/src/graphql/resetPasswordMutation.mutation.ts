import { gql } from '@apollo/client';

export const resetPasswordMutation = gql`
  mutation ResetPassword($newPassword: String!, $oldPassword: String!) {
    pretaaHealthResetPassword(newPassword: $newPassword, oldPassword: $oldPassword) {
      loginToken
      refreshToken
    }
  }
`;
