import { gql } from '@apollo/client';

export const forgetPasswordMutation = gql`
  mutation ForgotPassword($forgotPwToken: String!, $newPassword: String!) {
    pretaaHealthForgotPassword(forgotPwToken: $forgotPwToken, newPassword: $newPassword) {
      loginToken
      refreshToken
      message
    }
  }
`;
