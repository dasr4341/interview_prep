import { gql } from '@apollo/client';

export const getPatientsForMobileTemplate = gql`
query GetOnlyNamedPatientsForCampaign($facilityId: String, $inPatient: Boolean, $patientFilters: [String!], $search: String, $skip: Int, $take: Int) {
  pretaaHealthGetOnlyNamedPatients(facilityId: $facilityId, inPatient: $inPatient, patient_filters: $patientFilters, search: $search, skip: $skip, take: $take) {
    PatientContactList {
      careTeams {
        firstName
        lastName
        fullName
      }
    }
    patientDetails {
      inPatient
      gender
      genderIdentity
    }
    firstName
    id
    lastName
    userType
    email
  }
}
`;
