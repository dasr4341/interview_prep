import { gql } from '@apollo/client';

export const patientSupporterContactDelete = gql`
  mutation PatientSupporterDelete($supporterId: String!) {
    pretaaHealthPatientSupporterDelete(supporterId: $supporterId)
  }
`;
