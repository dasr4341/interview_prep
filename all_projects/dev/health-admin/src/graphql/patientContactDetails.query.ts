import { gql } from '@apollo/client';

export const patientContactDetailsQuery = gql`
  query PatientContactDetails($patientContactId: String!) {
    pretaaHealthViewPatientContact(patientContactId: $patientContactId) {
      email
      fullName
      phone
      relationship
    }
  }
`;
