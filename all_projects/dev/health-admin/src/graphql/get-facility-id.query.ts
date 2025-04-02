import { gql } from '@apollo/client';

export const getFacilityId = gql`
query GetFacilityId {
  pretaaHealthCurrentUser {
    employeeMeta {
      facilities {
        fitbitIdField
        sourceSystem {
          slug
        }
        name
      }
    }
  }
}
`;
