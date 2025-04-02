import { gql } from '@apollo/client';

export const getCompanyGroups = gql`
  query CompanyGroups($take: Int, $searchPhrase: String, $orderBy: OrderType) {
    pretaaGetLists(take: $take, searchPhrase: $searchPhrase, orderBy: $orderBy) {
      name
      id
      _count {
        listCompanies
      }
    }
  }
`;
