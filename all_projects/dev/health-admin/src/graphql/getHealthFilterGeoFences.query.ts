import { gql } from '@apollo/client';

export const getHealthFilterGeoFences = gql`
  query GetHealthFilterGeoFences($all: Boolean!, $global: Boolean!, $patients: [String!]!) {
    pretaaHealthFilterGeoFences(all: $all, global: $global, patients: $patients) {
      id
      name
      radius
      longitude
      latitude
      location
      facilityId
      patientId
      type
      status
      firstName
      lastName
    }
  }
`;
