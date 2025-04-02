import { gql } from '@apollo/client';

export const getCompanyListDetailsQuery = gql`
  query GetCompanyList(
    $listId: String!,
    $take: Int
  ) {
    pretaaGetList(listId: $listId) {
      id
      name
      listCompanies {
        companyId
      }
      groups(take: $take) {
        groupId
        group {
          name
          id
        }
      }
    }
  }
`;
