import { gql } from '@apollo/client';

export const RemoveUserGroupMutation = gql`
  mutation RemoveUserGroup(
    $groupId: String!
    $users: GroupUserUpdateManyWithoutGroupInput
  ) {
    pretaaUpdateGroup(id: $groupId, users: $users) {
      id
    }
  }
`;