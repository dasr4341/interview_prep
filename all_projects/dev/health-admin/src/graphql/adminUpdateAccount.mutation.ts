import { gql } from '@apollo/client';

export const updateAccountStatus = gql`
  mutation AdminUpdateAccountStatus($accountId: String!) {
    pretaaHealthAdminUpdateAccountStatus(accountId: $accountId) {
      status
    }
  }
`;
