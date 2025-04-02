import { gql } from '@apollo/client';

export const getPatientNameQuery = gql`
  query GetPatientName($patientId: String!) {
    pretaaHealthPatientDetails(patientId: $patientId) {
      firstName
      lastName
      id
      userFacilities {
        id
        name
      }
    }
  }
`;
