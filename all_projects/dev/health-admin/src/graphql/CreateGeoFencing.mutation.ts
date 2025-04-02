import { gql } from '@apollo/client';

export const createCounselorGeoFencing = gql`
  mutation CreateCounselorGeoFence(
    $name: String!
    $location: String!
    $type: GeoFencingTypes!
    $status: Boolean!
    $latitude: Float!
    $longitude: Float!
    $radius: Int!
    $patientId: String!
  ) {
    pretaaHealthCreateCounselorsGeoFence(
      name: $name
      location: $location
      type: $type
      status: $status
      latitude: $latitude
      longitude: $longitude
      radius: $radius
      patientId: $patientId
    ) {
      id
    }
  }
`;

export const createGeoFencing = gql`
  mutation CreateGeoFence(
    $name: String!
    $type: GeoFencingTypes!
    $status: Boolean!
    $patientId: String
    $latitude: Float!
    $location: String!
    $longitude: Float!
    $radius: Int!
    $facilityId: String
  ) {
    pretaaHealthCreateGeoFence(
      name: $name
      type: $type
      status: $status
      patientId: $patientId
      latitude: $latitude
      location: $location
      longitude: $longitude
      radius: $radius
      facilityId: $facilityId
    ) {
      id
    }
  }
`;
