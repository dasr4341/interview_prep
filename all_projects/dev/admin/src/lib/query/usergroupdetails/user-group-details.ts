import { gql } from '@apollo/client';

export const getGroupDetails = gql`
  query GetGroup($id: String!, $usersTake: Int, $groupId: String, $listTake: Int) {
    pretaaGetGroup(id: $id) {
      id
      name
      users(take: $usersTake) {
        userId
      }

      dataObjectCollections {
        name
        id
        default
        isAllAccess
      }
      useCaseCollections {
        id
        name
        default
      }
    }

    pretaaGetLists(groupId: $groupId, take: $listTake) {
      name
      id
      _count {
        listCompanies
      }
    }
  }
`;
