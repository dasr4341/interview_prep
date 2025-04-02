import { gql } from '@apollo/client';

export const getUserList = gql`
  query PretaaGetUserList(
    $skip: Int
    $take: Int
    $searchColumn: String
    $searchPhrase: String
    $orderBy: [PretaaUserOrderByInput!]
    $where: GroupUserWhereInput
  ) {
    pretaaGetUserList(
      skip: $skip
      take: $take
      searchColumn: $searchColumn
      searchPhrase: $searchPhrase
      orderBy: $orderBy
    ) {
      groups(where: $where) {
        groupId
      }
      email
      id
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
    }
  }
`;
