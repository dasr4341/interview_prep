import { gql } from '@apollo/client';

export const getPatientCoordinates = gql`
  query GetPatientCoordinates($patientId: String!, $skip: Int, $take: Int) {
    pretaaHealthGetPatientCoordinates(patientId: $patientId, skip: $skip, take: $take) {
      id
      longitude
      latitude
      createdAt
      lastLocationAddress
    }
  }
`;
