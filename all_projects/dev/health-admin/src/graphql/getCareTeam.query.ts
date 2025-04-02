import { gql } from '@apollo/client';

export const getCareTeam = gql`
 query GetCareTeamQuery($careTeamId: String!) {
  pretaaHealthEHRGetCareTeamMemberDetails(careTeamId: $careTeamId) {
    id
    user {
      firstName
      lastName
      email
      status
      active
      mobilePhone
      createdAt
      lastLoginTime
      userRole {
        name
      }
      id
    }
    careTeamTypes
  }
}
`;
