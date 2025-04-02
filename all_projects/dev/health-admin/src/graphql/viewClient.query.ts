import { gql } from '@apollo/client';

export const viewClientDetails = gql`
  query AdminViewClient($accountId: String!) {
    pretaaHealthAdminViewClient(accountId: $accountId) {
      id
      name
      renewalDate
      status
      superAdmin {
        email
        firstName
        id
        lastName
      }
    }
}
`;