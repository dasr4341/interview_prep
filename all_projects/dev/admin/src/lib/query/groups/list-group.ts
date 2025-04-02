import { gql } from '@apollo/client';

export const PretaaListGroupQuery = gql`
  query PretaaGetFilteredGroups(
    $companyListTake: Int, 
    $orderBy: [GroupOrderByWithRelationInput!],
    $searchPhrase: String
  ) {
    pretaaGetFilteredGroups(orderBy: $orderBy, searchPhrase: $searchPhrase) {
      id
      customerId
      name
      _count {
        users
      }
      dataObjectCollections {
        isAllAccess
        name
      }
      useCaseCollections {
        name
      }
      lists(take: $companyListTake) {
        list {
          name
        }
      }
    }
  }
`;
