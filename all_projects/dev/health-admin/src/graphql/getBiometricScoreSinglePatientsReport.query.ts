import { gql } from '@apollo/client';


export const getBiometricScoreSinglePatientsReportQuery = gql`
  query GetBiometricScoreSinglePatientsReport(
    $filterUsers: [RepotingPatientUsers!]
    $all: Boolean
  ) {
    pretaaHealthGetBiometricScoreSinglePatientsReport(
      filterUsers: $filterUsers
      all: $all
    ) {
      patientId
      scale
    }
  }
`;