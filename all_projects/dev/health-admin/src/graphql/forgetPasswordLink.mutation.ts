import { gql } from '@apollo/client';

export const forgetPasswordLinkMutation = gql`
mutation PretaaHealthForgotPasswordLink($email: String!) {
  pretaaHealthForgotPasswordLink(email: $email)
}
`;