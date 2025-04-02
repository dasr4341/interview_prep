import { gql } from '@apollo/client';

export const deleteGroup = gql`
  mutation PretaaDeleteGroup($groupId: String!) {
    pretaaDeleteGroup(id: $groupId) {
      id
    }
  } 
`;