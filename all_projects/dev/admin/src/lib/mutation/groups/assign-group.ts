import { gql } from '@apollo/client';

export const AssignGroupsMutation = gql`
  mutation AssignGroups($groups: [String!]!, $userId: String!) {
    pretaaAssignGroups(groups: $groups, userId: $userId) {
      id
    }
  }
`;