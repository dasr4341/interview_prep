import { gql } from '@apollo/client';

export const forgetPasswordLinkForAdmin = gql`
mutation AdminForgotPasswordLink($email: String!) {
  pretaaHealthAdminForgotPasswordLink(email: $email)
}
`;