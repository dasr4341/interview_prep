import { gql } from '@apollo/client';

export const viewGeoFence = gql`
  query PretaaHealthViewGeoFence($fenceId: String!) {
  pretaaHealthViewGeoFence(fenceId: $fenceId) {
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
}
`;