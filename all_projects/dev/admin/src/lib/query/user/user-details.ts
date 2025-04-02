import { gql } from '@apollo/client';

export const getUserDetails = gql`
  query UserDetails($userId: String!, $orderBy: [GroupUserOrderByWithRelationInput!], $take: Int) {
    pretaaGetUserDetails(userId: $userId) {
      id
      active
      firstName
      lastName
      department
      email
      dynamicFields
      csmStatus
      crmStatus
      userManager {
        id
        manager {
          id
          firstName,
          lastName
        }
      }

      roles {
        role {
          id
          name
        }
      }
      groups(orderBy: $orderBy) {
        groupId
        group {
          name
          groupUserCount
          dataObjectCollections {
            isAllAccess
            name
          }
          useCaseCollections {
            name
          }
          lists(take: $take) {
            list {
              name
            }
          }
        }
      }
    }
  }
`;
