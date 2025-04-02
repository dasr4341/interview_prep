import { gql } from '@apollo/client';

export const checkAdminExpiredLink = gql`
  query AdminCheckExpiredForgotPasswordLink($forgotPwToken: String!) {
    pretaaHealthAdminCheckExpiredForgotPasswordLink(forgotPwToken: $forgotPwToken) {
      email
    }
  }
`;
