import { gql } from '@apollo/client';

export const getStaffQuery = gql`
  query GetStaff($userId: String!) {
    pretaaHealthGetStaffUser(userId: $userId) {
      careTeamTypes
      email
      firstName
      facilities {
        name
        id
      }
      fullName
      id
      lastName
      mobilePhone
      roles {
        roleSlug
      }
      active
      lastLoginTime
    }
  }
`;

export const getStaffOnlyName = gql`
  query GetStaffOnlyName($userId: String!) {
    pretaaHealthGetStaffUser(userId: $userId) {
      firstName
      id
      lastName

      roles {
        roleSlug
      }
    }
  }
`;
