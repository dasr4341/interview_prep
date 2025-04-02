import { gql } from '@apollo/client';

export const ehrDeletePatientContactMutation = gql`
mutation EHRDeletePatientContact($patientContactId: String!) {
  pretaaHealthEHRDeletePatientContact(patientContactId: $patientContactId)
}
`;