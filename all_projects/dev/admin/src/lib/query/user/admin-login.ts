import { gql } from '@apollo/client';

export const adminLoginQuery = gql`
  query AdminLogin($password: String!, $email: String!) {
    pretaaAdminLogin(password: $password, email: $email)
  }
`;
