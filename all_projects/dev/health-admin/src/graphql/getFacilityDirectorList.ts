import { gql } from '@apollo/client';

export const getFacilityDirectorList = gql`
  query GetFacilityDirector($facilityId: String) {
    pretaaHealthGetFacilityDirector(facilityId: $facilityId) {
      id
      first_name
      last_name
      care_team_types
    }
  }
`;