import { gql } from '@apollo/client';

export const updateUserGroup = gql`
   mutation UpdateUserGroup(
    $id: String!
    $name: String
    $users: GroupUserUpdateManyWithoutGroupInput
    $lists: GroupListUpdateManyWithoutGroupInput
    $dataObjectCollectionId: String
    $useCaseCollectionId: String
  ) {
    pretaaUpdateGroup(
      id: $id
      name: $name
      users: $users
      lists: $lists
      dataObjectCollectionId: $dataObjectCollectionId
      useCaseCollectionId: $useCaseCollectionId
    ) {
      id
    }
  }
`;
