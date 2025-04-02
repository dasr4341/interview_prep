import { graphql } from '@/generated/gql';

export const ADMIN_LOGIN = graphql(`
  mutation adminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      message
      success
      signInToken {
        accessToken
        refreshToken
      }
    }
  }
`);
