import { gql } from '@apollo/client';

export const pretaaHealthRemoveFacility = gql`
  mutation RemoveFacility($facilityId: String!) {
    pretaaHealthRemoveFacility(facilityId: $facilityId) {
      id
    }
  }
`;
