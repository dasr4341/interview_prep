import { gql } from '@apollo/client';

export const ehrUpdatePatient = gql`
  mutation EHRUpdatePatient(
    $pretaaHealthEhrUpdatePatientId: String!
    $patientDetails: EHRPatientDetailsUpdate!
    $careTeams: [EHRCareTeamMatrices!]
    $contacts: [Contacts!]
  ) {
    pretaaHealthEHRUpdatePatient(
      id: $pretaaHealthEhrUpdatePatientId
      patientDetails: $patientDetails
      careTeams: $careTeams
      contacts: $contacts
    )
  }
`;
