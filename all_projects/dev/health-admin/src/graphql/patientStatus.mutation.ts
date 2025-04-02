import { gql } from '@apollo/client';

export const updatePatientStatus = gql`
  mutation PatientActiveToggle($patinetId: String!) {
    pretaaHealthPatientActiveToggle(patinetId: $patinetId)
  }
`;
