import { gql } from '@apollo/client';

export const createPatientEHR = gql`
  mutation EHRAddPatient(
    $patientDetails: EHRPatientDetails!
    $careTeams: [EHRCareTeamMatrices!]
    $contacts: [Contacts!]
    $facilityId: String
  ) {
    pretaaHealthEHRAddPatient(
      patientDetails: $patientDetails
      careTeams: $careTeams
      contacts: $contacts
      facilityId: $facilityId
    )
  }
`;
