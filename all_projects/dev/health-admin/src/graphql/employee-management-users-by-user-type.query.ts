import { gql } from '@apollo/client';

export const employeeManagementGetUsersByUserType = gql`
query GetUsersByUserType($facilityId: String, $take: Int, $skip: Int) {
  pretaaHealthGetUsersByUserType(facilityId: $facilityId, take: $take, skip: $skip) {
    fullName
    email
    createdAt
    mobilePhone
    lastLoginTime
    active
    accountId
    id
    userRole {
      name
    }
  }
}
`;