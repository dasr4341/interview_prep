import { gql } from '@apollo/client';

export const DeactivateUserMutation  = gql`
  mutation PretaaChangeManyUserStatus($userIds: [String!]!) {
    pretaaChangeManyUserStatus(userIds: $userIds, deactivate: true) {
      id
    }
  }
`;
