import { gql } from '@apollo/client';

export const checkExpiredForgotPassword = gql`
  query CheckExpiredForgotPasswordLink($forgotPwToken: String!) {
    pretaaHealthCheckExpiredForgotPasswordLink(forgotPwToken: $forgotPwToken) {
      email
    }
  }
`;
