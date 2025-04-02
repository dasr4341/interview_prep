import { gql } from '@apollo/client';

export const adminForgetPasswordMutation = gql`
 mutation AdminForgotPassword($forgotPwToken: String!, $newPassword: String!) {
  pretaaHealthAdminForgotPassword(forgotPwToken: $forgotPwToken, newPassword: $newPassword)
}
`;
