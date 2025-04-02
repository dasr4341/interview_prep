import { gql } from '@apollo/client';

export const clientListAccountsQuery = gql`
  query ClientListAccounts($searchPhrase: String, $skip: Int, $take: Int) {
    pretaaHealthAdminListAccounts(searchPhrase: $searchPhrase, skip: $skip, take: $take) {
      # This id is required for change status
      id
      name
      status
      renewalDate
      superAdmin {
        email
        firstName
        id
        lastName
      }
      _count {
        facilities
      }
    }
  }
`;
