import { gql } from '@apollo/client';

export const getGeoFencesQuery = gql`
query ListGeoFences($searchPhrase: String, $skip: Int, $take: Int) {
    pretaaHealthListGeoFences(searchPhrase: $searchPhrase, skip: $skip, take: $take) {
      id
      name
      location
      type
      status
      latitude
      longitude
      radius
      patientId
      canEdit
      facility {
        id
        name
      }
    }
  }
`;
