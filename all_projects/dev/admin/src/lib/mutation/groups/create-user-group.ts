import { gql } from '@apollo/client';

export const createUserGroup = gql`
  mutation CreateUserGroup(
    $name: String!
    $users: GroupUserCreateNestedManyWithoutGroupInput
    $dataObjectCollectionId: String!
    $useCaseCollectionId: String!
  ) {
    pretaaCreateGroup(
      name: $name
      users: $users
      dataObjectCollectionId: $dataObjectCollectionId
      useCaseCollectionId: $useCaseCollectionId
    ) {
      id
    }
  }
`;
