import { gql } from '@apollo/client';

export const facilityUserList = gql`
  query FacilityUserList($facilityId: String!) {
    pretaaHealthViewFacility(facilityId: $facilityId) {
      primaryAdmin {
        email
        firstName
        id
        lastName
      }
    }
  }
`;