import { gql } from '@apollo/client';

export const toggleUserStatus = gql`
  mutation UpdateUserStatus($userId: String!) {
    pretaaChangeUserStatus(userId: $userId) {
      active
    }
  }
`;
