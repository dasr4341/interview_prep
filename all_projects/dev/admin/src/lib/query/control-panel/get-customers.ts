import { gql } from '@apollo/client';

export const getCustomersQuery = gql`
  query PretaaAdminGetCustomers($skip: Int, $take: Int, $searchPhrase: String) {
    pretaaAdminGetCustomers(skip: $skip, take: $take, searchPhrase: $searchPhrase) {
      id
      name
      oktaDomain
      oktaClientId
      isActive
      startDate
      renewalDate
      _count {
        users
      }
    }
  }
`;
