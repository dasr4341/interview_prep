import { gql } from '@apollo/client';

export const updateClient = gql`
  mutation AdminUpdateClient($name: String!, $accountId: String!) {
    pretaaHealthAdminUpdateClient(name: $name, accountId: $accountId) {
      id
    }
  }
`;
