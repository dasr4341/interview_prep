import { gql } from '@apollo/client';

export const pretaaAdminLoginQuery = gql`
  query PretaaAdminLogin($email: String!, $password: String!) {
    pretaaHealthAdminLogin(email: $email, password: $password) {
      loginToken
      message
      refreshToken
      twoFactorAuthToken
      twoFactorAuthentication
    }
  }
`;
