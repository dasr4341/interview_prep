import { gql } from '@apollo/client';

export const assignUserManager = gql`
  mutation AssignUserManager($managerId: String!, $userId: String!) {
    pretaaAssignUserManager(managerId: $managerId, userId: $userId) {
      id
      active
      firstName
      lastName
      email
      dynamicFields

      userManager {
        id
        manager {
          id
          name
        }
      }
    }
  }
`;
