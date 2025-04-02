import { gql } from '@apollo/client';

export const updateGeoFenceForCounselor = gql`
  mutation UpdateGeoFenceForCounselors(
    $latitude: Float!
    $longitude: Float!
    $fenceId: String!
    $name: String
    $type: GeoFencingTypes
    $status: Boolean
    $radius: Int
    $location: String
    $patientId: String!
  ) {
    pretaaHealthUpdateCounselorsGeoFence(
      latitude: $latitude
      longitude: $longitude
      fenceId: $fenceId
      name: $name
      type: $type
      status: $status
      radius: $radius
      location: $location
      patientId: $patientId
    ) {
      id
    }
  }
`;

export const updateGeoFence = gql`
  mutation UpdateGeoFence(
    $fenceId: String!
    $name: String
    $type: GeoFencingTypes
    $status: Boolean
    $latitude: Float!
    $location: String
    $longitude: Float!
    $radius: Int
  ) {
    pretaaHealthUpdatetGeoFence(
      fenceId: $fenceId
      name: $name
      type: $type
      status: $status
      latitude: $latitude
      location: $location
      longitude: $longitude
      radius: $radius
    ) {
      id
    }
  }
`;