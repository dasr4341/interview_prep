import { gql } from '@apollo/client';

export const getPretaaAdminUserQuery = gql`
  query GetPretaaAdminUser {
    pretaaHealthAdminCurrentUser {
      createdAt
      email
      id
      forgetPassword
      mobilePhone
      title
      # Todo: set user type 
    }
  }
`;
