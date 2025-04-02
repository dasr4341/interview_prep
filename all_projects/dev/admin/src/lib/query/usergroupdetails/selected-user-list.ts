import { gql } from '@apollo/client';

export const getSelectedGroupUserDetails = gql`
  query SelectedGroupUserDetails($id: String!, $usersTake: Int, $usersSkip: Int, $usersWhere: GroupUserWhereInput, $where: GroupUserWhereInput) {
    pretaaGetGroup(id: $id) {
      id
      users(take: $usersTake, skip: $usersSkip, where: $usersWhere) {
        userId
        user {
          email
          id
          name
          dynamicFields
          csmStatus
          crmStatus
          active
          userManager {
            manager {
              id
              name
            }
          }
          roles {
            role {
              id
              name
            }
          }
          firstName
          lastName
          department
          workPhone
          mobilePhone
          title
          groups(where: $where) {
            groupId
          }
        }
      }
    }
  }
`;

export const getSelectedUsersForGroup = gql`
  query SelectedGroupUsers(
    $id: String!
    $skip: Int
    $take: Int
    $usersWhere: GroupUserWhereInput
    $usersOrderBy: [GroupUserOrderByWithRelationInput!]
  ) {
    pretaaGetGroup(id: $id) {
      id
      users(take: $skip, skip: $take, where: $usersWhere, orderBy: $usersOrderBy) {
        userId
      }
    }
  }
`;
