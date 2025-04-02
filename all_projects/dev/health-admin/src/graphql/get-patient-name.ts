import { gql } from '@apollo/client';

export const patientNameQuery = gql`
  query PatientName($patientId: String!) {
    pretaaHealthPatientDetails(patientId: $patientId) {
      lastName
      firstName
      id
    }
  }
`;
