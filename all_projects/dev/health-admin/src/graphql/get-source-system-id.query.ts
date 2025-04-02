import { gql } from '@apollo/client';

export const getSourceSystemId = gql`
  query GetSourceSystemId($facilityId: String!) {
    pretaaHealthViewFacility(facilityId: $facilityId) {
      sourceSystemId
    }
  }
`;