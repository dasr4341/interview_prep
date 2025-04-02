import { gql } from '@apollo/client';

export const getPatientsListForCounsellor = gql`
query GetOnlyNamedPatients($take: Int, $skip: Int, $search: String, $patientFilters: [String!], $inPatient: Boolean, $facilityId: String) {
  pretaaHealthGetOnlyNamedPatients(take: $take, skip: $skip, search: $search, patient_filters: $patientFilters, inPatient: $inPatient, facilityId: $facilityId) {
    email
    firstName
    id
    active
    lastName
    userType
    patientDetails {
      inPatient
      gender
      genderIdentity
    }
    PatientContactList {
      careTeams {
        firstName
        fullName
        lastName
      }
    }
  }
}
`;
