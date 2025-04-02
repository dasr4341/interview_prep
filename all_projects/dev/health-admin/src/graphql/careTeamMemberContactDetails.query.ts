import { gql } from '@apollo/client';

export const careTeamMemberContactDetailsQuery = gql`
  query CareTeamMemberContactDetails($careTeamId: String!) {
    pretaaHealthEHRGetCareTeamMemberDetails(careTeamId: $careTeamId) {
      user {
        firstName
        lastName
        email
        mobilePhone
      }
    }
  }
`;
