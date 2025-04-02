import { gql } from '@apollo/client';

export const getGeoFencesMapViewQuery = gql`
  query GeoFencesMapListForPatient($take: Int, $patientId: String!) {
  pretaaHealthListGeoFences(take: $take) {
    id
    name
    location
    type
    status
    latitude
    longitude
    radius
    patientId
  }
  pretaaHealthGetGeoFencesByPatientId(patientId: $patientId) {
    patientFences {
      id
      name
      location
      type
      status
      latitude
      longitude
      radius
    }
  }
}
`;

