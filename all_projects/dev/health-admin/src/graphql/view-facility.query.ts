import { gql } from '@apollo/client';

export const viewFacility = gql`
  query ViewFacility($facilityId: String!) {
    pretaaHealthViewFacility(facilityId: $facilityId) {
      facilitySourceFields {
        value
        name
        id
      }
      id
      name
      sourceSystemId
      primaryAdmin {
        email
        firstName
        lastName
      }
      offset
      timeZone
    }
  }
`;