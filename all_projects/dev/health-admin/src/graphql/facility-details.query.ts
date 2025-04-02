import { gql } from '@apollo/client';

export const facilityDetails = gql`
  query PretaaHealthViewFacility($facilityId: String!) {
    pretaaHealthViewFacility(facilityId: $facilityId) {
      name
    }
  }
`;