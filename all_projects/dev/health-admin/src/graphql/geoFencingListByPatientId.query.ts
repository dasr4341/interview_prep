import { gql } from '@apollo/client';

export const getGeoFencesQueryById = gql`
 query GetGeoFencesByPatientId($patientId: String!, $skip: Int, $take: Int, $searchPhrase: String) {
    pretaaHealthGetGeoFencesByPatientId(patientId: $patientId, skip: $skip, take: $take, searchPhrase: $searchPhrase) {
      patientFences {
        id
        name
        location
        type
        status
        latitude
        longitude
        radius
        canEdit
      }
    }
  }
`;
