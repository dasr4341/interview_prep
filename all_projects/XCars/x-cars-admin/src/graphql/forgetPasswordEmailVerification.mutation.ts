import { graphql } from '@/generated/gql';

export const FORGET_PASSWORD_SEND_EMAIL = graphql(`
  mutation AdminForgetPassword($email: String!) {
    adminForgetPassword(email: $email) {
      message
      success
    }
  }
`);

export const FORGET_PASSWORD_VERIFY_TOKEN = graphql(`
  mutation AdminForgetPasswordEmailVerification($token: String!) {
    adminForgetPasswordEmailVerification(token: $token) {
      message
      success
      token
    }
  }
`);

export const RESET_PASSWORD = graphql(`
  mutation AdminSetForgetPassword($token: String!, $newPassword: String!) {
    adminSetForgetPassword(token: $token, newPassword: $newPassword) {
      message
      success
    }
  }
`);
